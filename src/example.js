const apiBase = 'https://api.github.com'

const axios = require('axios')
const config = require('./config')
const chalk = require('chalk')
const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// Pluck out the node command line options using regex.
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

// Progress Indicator

// var ProgressBar = require('progress')

// var bar = new ProgressBar(':bar', { total: 50 })

// function startProgress () {
//   var timer = setInterval(function() {
//     bar.tick()
//     if (bar.complete) {
//       console.log('\ncomplete\n')
//       clearInterval(timer)
//     }
//   }, 100)
// }

console.log(chalk.green(`Fetching comments for past ${timePeriod} for "${repoArg}"...`))

async function printCurrentUserDetails() {
  try {
    // startProgress()
    let response = []
    let totalResponses = 0

    while (response.length === 30) {
      const response = await http.get(`/repos/${userName}/${repoName}/comments`)
      const dataLength = response.data.length
      totalResponses = totalResponses + dataLength
      console.dir(response.data, { colors: true, depth: 4 })
    }
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printCurrentUserDetails()
