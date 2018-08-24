const chalk = require('chalk')
const config = require('./config')

console.log(chalk.yellow('Your github token is:'))
console.info(chalk.yellow(config.GITHUB_PERSONAL_ACCESS_TOKEN))

console.log(chalk.red('Command line options'));
process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val)
})
// remove this line
require('./example')
