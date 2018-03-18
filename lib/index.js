const chalk = require('chalk');
const argv = require('yargs').argv;
const exclamation = require('./exclamation.js');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const hash = crypto.createHash('md5');
const prompt = require('prompt');

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

let command;

switch(argv._[0])
{
  case 'store':
  case 'e':
  {
    command = 'encrypt';
  } break;

  case 'reveal':
  case 'd':
  {
    command = 'decrypt';
  } break;

  default:
  {
    console.log(`${chalk.red(exclamation.bad())}`);
    console.log(`${chalk.red('invalid command')}: choose one of`);
    console.log(`  ${chalk.yellow('a.')} ${chalk.green('store')} or ${chalk.green('e')} - encrypt the file with the given name and extension`);
    console.log(`  ${chalk.yellow('b.')} ${chalk.green('reveal')} or ${chalk.green('d')} - decrypt the file with the given name (without extension)`);
    process.exit(1);
  } break;
}

if(!argv._[1])
{ console.log(`${chalk.red(exclamation.bad())}: where's the file?`);
  process.exit(1);
}

let file = argv._[1];

switch(command)
{
  case 'encrypt':
  {
    if(!fs.existsSync(file))
    { console.log(`${chalk.red(exclamation.bad())}: that file doesn't exist!`);
      process.exit(1);
    }
  } break;

  case 'decrypt':
  {
    if(!fs.existsSync(file + '.cj'))
    { console.log(`${chalk.red(exclamation.bad())}: looks like you haven't encrypted a file with that name before!`);
      process.exit(1);
    }
  } break;
}

prompt.start();

prompt.get
([
  { name: 'key'
  , hidden: true
  , replace: '*'
  , description: 'please input key'
  , conform: function(value)
    { return value != '';
    }
  }
],
(err, result) =>
{
  if(err)
  {
    console.log(`\n${chalk.red(exclamation.bad())}: bad key, try again!`);
    process.exit(1);
  }

  if(!result.key)
  {
    console.log(`${chalk.red(exclamation.bad())}: bad key, try again!`);
    process.exit(1);
  }

  run(result.key);
});

function run(key)
{
  switch(command)
  {
    case 'encrypt':
    {
      key = padKey(key);
      let name = path.basename
      ( file,
        path.extname(file)
      );

      let iv = crypto.randomBytes(16);
      let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let input = fs.createReadStream(file);
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

    case 'decrypt':
    {
      key = padKey(key);
      let name = file;

      let iv = fs.readFileSync(`${name}.cjiv`);
      let cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let input = fs.createReadStream(`${name}.cj`);

      process.on('SIGINT', () =>
      {
        console.log('\033[2J');
        process.exit();
      });

      input.pipe(cipher);

      const chunks = [];

      cipher.on('data', (chunk) =>
      {
        chunks.push(chunk);
      });

      cipher.on('error', (err) =>
      {
        console.log(`${chalk.red(exclamation.bad())}: bad key, try again!`);
        process.exit(1);
      });

      cipher.on('end', () =>
      {
        console.log(Buffer.concat(chunks).toString());
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

