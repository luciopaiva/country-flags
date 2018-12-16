
const fs = require("fs");

function unquote(str) {
    return str.replace(/^"|"$/g, "");
}

const file = fs.readFileSync("countrycode.csv", "utf-8");
const lines = file.split("\n");
const allTable = lines
    .map(line => line.replace(/^\s+|\s+$/g, ""))  // trim
    .filter(line => line.length > 0)  // remove empty lines
    .map(line => line.split(","))  // split columns
    .map(line => line.map(unquote));  // remove quotes

const table = allTable
    .slice(1)  // remove header row
    .map(row => [row[0], row[1], row[5]]);  // extract country name, iso-2 and iso-numeric

/*
 * Numeric to alpha-2 conversion via direct addressing. Generates a large array, but lookup is done fast via indexing
 */
const largestNumeric = table.reduce((largest, row) => Math.max(largest, parseInt(row[2])), 0);
/** @type {String[]} */
const numericToAlpha2DirectAddressing = Array(largestNumeric + 1).fill(null);
for (const row of table) {
    const numeric = parseInt(row[2]);
    numericToAlpha2DirectAddressing[numeric] = row[1];
}

/*
 * Numeric to alpha-2 conversion via hash table.
 */
/** @type {Map<Number, String>} */
const numericToAlpha2 = new Map();
for (const row of table) {
    numericToAlpha2.set(parseInt(row[2]), row[1]);
}

/*
 * Numeric to alpha-2 conversion via hash table, code generated.
 */
console.info("// generated with https://github.com/luciopaiva/country-codes");
console.info(`const numericToAlpha2 = new Map([${[...numericToAlpha2.entries()].map(pair => `[${pair[0]},"${pair[1]}"]`)}]);`);
