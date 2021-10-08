import inquirer from 'inquirer';
import { readFile } from 'jsonfile';

import { getLogger } from 'modules/logging';

const log = getLogger('app');

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const pickRandom = (array) => array[Math.floor(Math.random() * array.length)];

const execute = async () => {
  const animals = await readFile('./src/data/animals.json');
  const adjectives = await readFile('./src/data/adjectives.json');

  const { releaseNumber } = await inquirer.prompt([
    {
      type: 'number',
      name: 'releaseNumber',
      message: 'Which release are you on?',
      default: 1
    }
  ]);

  const releaseIndex = (releaseNumber - 1) % 26;
  const releaseLetter = letters[releaseIndex];

  const adjective = pickRandom(adjectives[releaseLetter]);
  const animal = pickRandom(animals[releaseLetter]);

  const releaseName = `${adjective.charAt(0).toUpperCase()}${adjective.slice(
    1
  )} ${animal.charAt(0).toUpperCase()}${animal.slice(1)}`;

  log.info(`Your release name is ${releaseName}`);
};

execute();
