/*
   This is a Node.js script that is used to generated country info for dist/country-flag.js based on data from
   country-code.csv.
 */

const fs = require("fs");

function unquote(str) {
    return str.replace(/^"|"$/g, "");
}

/**
 * The input CSV file is expected to have the following columns in this order:
 * - country name
 * - ISO alpha-2
 * - ISO alpha-3
 * - top-level domain
 * - (skipped column)
 * - ISO numeric
 *
 * There can be more columns after, but it's important that the first ones are exactly these.
 *
 * Output is an array of tuples, where each tuple is:
 *
 *     [isoNumeric, "Country name", "ISO alpha-2", "ISO alpha-3", "top-level domain"]
 *
 * Country names are in English and alpha and top-level domain codes are lower case. ISO numeric is a Number.
 *
 * @return {Array<[Number, String, String, String, String]>}
 */
function loadAndProcessCsvFile() {
    const file = fs.readFileSync("country-code.csv", "utf-8");
    const lines = file.split("\n");
    const tableWithAllColumns = lines
        .map(line => line.replace(/^\s+|\s+$/g, ""))  // trim
        .filter(line => line.length > 0)  // remove empty lines
        .map(line => line.split(","))  // split columns
        .map(line => line.map(unquote));  // remove quotes

    return tableWithAllColumns
        .slice(1)  // remove header row
        .map(row => [
            parseInt(row[5]),  // iso numeric
            row[0],  // name
            row[1].toLowerCase(),  // iso 2
            row[2].toLowerCase(),  // iso 3
            row[3].toLowerCase(),  // top-level domain
        ]);
}

const outputTable = loadAndProcessCsvFile();

console.info(JSON.stringify(outputTable));
