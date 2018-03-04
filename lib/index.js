const chalk = require('chalk');
const argv = require('yargs').argv;
const exclamation = require('./exclamation.js');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const hash = crypto.createHash('md5');

const DraftLog = require('draftlog')
require('draftlog').into(console);

const header = `
         ${chalk.yellow('-̆̆̆+-')}
      ${chalk.yellow('(͠ ͡ ^̆̆̆̆̆̆O^͡ ͠ )')}
       ${chalk.yellow('\\')+chalk.magenta('##')+chalk.yellow('║')+chalk.magenta('##')+chalk.yellow('/')}
       ${chalk.yellow('[')+chalk.green('@')+chalk.yellow('-')+chalk.red('@')+chalk.yellow('-')+chalk.green('@')+chalk.yellow(']')}
       -------
 ${chalk.yellow('~{')}${chalk.red(new Array(16).join('-'))}${chalk.yellow('}~')}
 `;

console.log(header);

if(['hide', 'reveal'].indexOf(argv._[0]) == -1)
{
  console.log(`${chalk.red('invalid command')}: choose one of`);
  console.log(`  ${chalk.yellow('a.')} ${chalk.green('hide')} - encrypt the file with the given name and extension`);
  console.log(`  ${chalk.yellow('b.')} ${chalk.green('reveal')} - decrypt the file with the given name (without extension)`);
  process.exit(1);
}

let options = [];

if(!argv.key)
{ options.push('key');  
}

if(!argv.file)
{ options.push('file');
}

if(options.length > 0)
{ options = options.map((option) => {return chalk.yellow('--' + option);});

  console.log(`${chalk.red(exclamation.bad())}: where${options.length < 2 ? '\'s' : ' are'} the ${options.join(' and ')} option${options.length > 1 ? 's' : ''}?`);
  process.exit(1);
}

switch(argv._[0])
{
  case 'hide':
  {
    let key = padKey(argv.key);
    let name = path.basename
    ( argv.file,
      path.extname(argv.file)
    );

    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let input = fs.createReadStream(argv.file);
    let output = fs.createWriteStream(`${name}.cj`);

    Promise.all
    ([
      new Promise((resolve, reject) =>
      {
        output.on('finish', () =>
        {
          resolve();
        });
      })
    , new Promise((resolve, reject) =>
      {
        fs.writeFile(`${name}.cjiv`, iv, () =>
        {
          resolve();
        });
      })
    ])
    .then(() =>
    {
      console.log(`${chalk.green('✔')} ${exclamation.good()}!`);
    });

    input.pipe(cipher).pipe(output);
  } break;

  case 'reveal':
  {
    let key = padKey(argv.key);
    let name = argv.file;

    let iv = fs.readFileSync(`${name}.cjiv`);
    let cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let input = fs.createReadStream(`${name}.cj`);

    console.log('####################\n');

    process.on('SIGINT', () =>
    {
      console.log('\033[2J');
      process.exit();
    });

    input.pipe(cipher).pipe(process.stdout);
    input.on('end', () =>
    {
      console.log('\n');
      let left = 180;
      let base = 'Display will autoclear in: ';
      var update = console.draft(base);

      setInterval(() =>
      {
        --left;

        if(left == 0)
        {
          console.log('\033[2J');
          process.exit();
        }

        if(left == 1)
        {
          update(`${base} ${chalk.red(left)} second`);
          return;
        }

        if(left < 10)
        {
          update(`${base} ${chalk.red(left)} seconds`);
          return;
        }

        if(left < 60)
        {
          update(`${base} ${chalk.yellow(left)} seconds`);
          return;
        }

        update(`${base} ${chalk.green(left)} seconds`);
        
      }, 1000);
    });

  } break;
}

function padKey(key)
{ let keyArray = key.split('');
  let iv = crypto.randomBytes(16);

  if(key.length < 32)
  {
    let padding = hash.update(key).digest('hex');
    let spacing = Math.floor((32 - key.length) / (key.length - 1));

    for(let p = 0, i = 1, j = 0; keyArray.length < 32; ++p, ++i)
    {
      keyArray.splice((j * spacing) + (j * 1) + i, 0, padding[p]);
      if(i == spacing)
      {
        i = 0;
        ++j;
      }
    }
  }

  return keyArray.join('');
}

