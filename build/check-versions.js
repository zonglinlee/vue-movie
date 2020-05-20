//Terminal string styling tool 命令行文本样式工具
//https://github.com/chalk/chalk
var chalk = require('chalk')
//The semantic versioner for npm 用校验包的版本号是否符合某一个规则
//https://github.com/npm/node-semver
//semantic version规范：https://github.com/semver/semver/blob/master/semver.md 
var semver = require('semver')
var packageConfig = require('../package.json')
//Portable Unix shell commands for Node.js
//https://documentup.com/shelljs/shelljs
var shell = require('shelljs')
//创建一个同步的子进程来 执行 npm 命令
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    //semver.clean('  =v1.2.3   ') // '1.2.3' 
    //这里规定的node和npm版本来自于package.json 中的engins，这个是自行添加的
    //如果不做规定，则认为只要在node环境下就可以了。
    versionRequirement: packageConfig.engines.node
  },
]
//如果能找到npm这个环境变量，就往 versionRequirements 这个数组中添加一个npm包的对象
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    //The process.exit() method instructs Node.js to
    // terminate the process synchronously with an exit status of code
    process.exit(1)
  }
}
