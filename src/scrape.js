import got from 'got';
import { load } from 'cheerio';
import { writeFile } from 'jsonfile';

import { getLogger } from 'modules/logging';

const log = getLogger('app');

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const fetchWords = async (url, className) => {
  const results = [];
  const response = await got(url);
  const $ = load(response.body);

  $(`.${className} .word a`).each((i, v) => {
    const $el = $(v);
    const text = $el.text();

    if (/\s+/.test(text) || i % 2 == 0) {
      return;
    }

    results.push(text);
  });

  return results;
};

const execute = async () => {
  const animals = {},
    adjectives = {};

  log.info('Starting data generation...');

  for (const letter of letters) {
    animals[letter] = await fetchWords(
      `https://nounsstarting.com/animals-that-start-with-${letter}/`,
      'listing_words'
    );
    adjectives[letter] = await fetchWords(
      `https://adjectivesstarting.com/with-${letter}/`,
      'listing_adjectives'
    );
  }

  await writeFile('./src/data/animals.json', animals);
  await writeFile('./src/data/adjectives.json', adjectives);
};

execute();
