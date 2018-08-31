const apiBase = 'https://api.github.com'

const axios = require('axios')
const config = require('./config')
const chalk = require('chalk')
const ProgressBar = require('progress')
const leftPad = require('left-pad')

// Axios object for api requests

const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// Clear command line for results

console.reset = function() {
  return process.stdout.write('\033c')
}
console.reset()

// Harcoded total of 4 ticks.  Each tick represents api requests sent out.
// 3 ticks when obtaining each of the comments. This occurs quickly because of concurrent requests
// Last tick when obtaining commit amounts.

var bar = new ProgressBar(':bar', { total: 4 })

// Pluck out the node command line options using regex into variables.
let repoName
let timePeriod
let userName
let repoArg

for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--repo') {
    repoArg = process.argv[i + 1]
    userName = repoArg.match(/[^ /]*/)[0]
    repoName = repoArg.match(/(?!.*\/).+/)[0]
  } else if (process.argv[i] === '--period') {
    timePeriod = process.argv[i + 1]
  }
}

// console.log command line node options
if (timePeriod && repoArg) {
  console.log(
    chalk.green(`Fetching comments for past ${timePeriod} for "${repoArg}"...`),
  )
} else if (repoArg) {
  console.log(chalk.green(`Fetching comments for "${repoArg}"...`))
} else {
  console.log(chalk.red('Please provide repository url'))
  process.exit()
}

// Returns a boolean to check if the comment is within the specified date.

function withinTime(date) {
  const timeOption = parseInt(timePeriod.match(/[^d]*/)[0])
  var oneDay = 24*60*60*1000
  var commentDate = new Date(date)
  var currentDate = new Date()

  var diffDays = Math.round(Math.abs((commentDate.getTime() - currentDate.getTime()) / (oneDay)));
  
  if (diffDays > timeOption) return false

  return true
}


//Returns promise to get data from github API.  

async function requestData(url) {
    let totalData = []
    let results = []
    let page = 1
    
    
    while (page === 1 || results.length === 100) {
      const response = http.get(url + `?page=${page}`)
      const data = await response
      results = data.data
      totalData = totalData.concat(results)
      page++
    }
    
    if (timePeriod) {
      totalData = totalData.filter(data => {
        return withinTime(data.created_at)
      })
    }
    bar.tick()
    return totalData
}

// Returns promise to count number of comments for each user

function getUsers(data) {
  const users = {}
  data.forEach(comment => {
    users[comment.user.login] = users[comment.user.login] + 1 || 1
  })
  return users
}



function countCommits(url) {
  return new Promise(async function(resolve) {
    const result = {}
    const response = await http.get(url)
    const data = response.data
    bar.tick()

    data.forEach(commit => {
      result[commit.author.login] = commit.total
    })
    resolve(result)
  })
}

// Achieved getting data in a concurrent manner, runs much faster than awaiting each promise sequentially.

async function printDetails() {
  try {
    const totalPulls = requestData(
      `/repos/${userName}/${repoName}/pulls/comments?per_page=100`,
    )
    const totalCommits = requestData(
      `/repos/${userName}/${repoName}/comments?per_page=100`,
    )
    const totalIssues = requestData(
      `/repos/${userName}/${repoName}/issues/comments?per_page=100`,
    )

    
    const completeResults = [].concat(
      await totalCommits,
      await totalIssues,
      await totalPulls,
    )
    

    const users = getUsers(completeResults)

    const results = await countCommits(`/repos/${userName}/${repoName}/stats/contributors`)  
    
    // Format console.log based on number of digits of comments (left-pad)

    for (let key in users) {
      if (users.hasOwnProperty(key)) {
        if (results[key] === undefined) {
          results[key] = 0
        }

        if (users[key] < 10) {
          console.log(leftPad(users[key], 4) + ` comments, ${key} (${results[key]} commits)`)
        } else if (users[key] < 100) {
          console.log(leftPad(users[key], 4) + ` comments, ${key} (${results[key]} commits)`)
        } else if (users[key] < 1000) {
          console.log(leftPad(users[key], 4) + ` comments, ${key} (${results[key]} commits)`)
        } else {
          console.log(`${users[key]} comments, ${key} (${results[key]} commits)`)
        }
      }
    }
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response, { colors: true, depth: 4 })
  }
}

printDetails()
