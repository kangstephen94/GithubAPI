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

async function printCurrentUserDetails() {
  try {
    const response = await http.get(`/repos/kangstephen94/wallstreetbets/commits?per_page=50`)
    console.dir(response.data.length, { colors: true, depth: 4 })
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printCurrentUserDetails()
