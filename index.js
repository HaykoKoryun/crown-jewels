const chalk = require('chalk');

const header = `
         ${chalk.yellow('-̆̆̆+-')}
      ${chalk.yellow('(͠ ͡ ^̆̆̆̆̆̆O^͡ ͠ )')}
       ${chalk.yellow('\\')+chalk.magenta('##')+chalk.yellow('║')+chalk.magenta('##')+chalk.yellow('/')}
       ${chalk.yellow('[')+chalk.green('@')+chalk.yellow('-')+chalk.red('@')+chalk.yellow('-')+chalk.green('@')+chalk.yellow(']')}
       -------
 ${chalk.yellow('~{')}${chalk.red(new Array(16).join('-'))}${chalk.yellow('}~')}`;

console.log(header);