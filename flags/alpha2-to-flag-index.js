
const fs = require("fs");

const css = fs.readFileSync(__dirname + "/flags.css", "utf-8");
let lines = css.split("\n");

lines = lines
    .map(line => line.replace(/[\s}]+/g, ""))
    .filter(line => /.flag.flag|background-position/.test(line));  // get rid of irrelevant lines

let alpha2ToFlagIndex = new Map();
for (let i = 0; i < lines.length; i += 2) {
    const alpha2 = lines[i].match(/.flag.flag-(..)/)[1];
    const m = lines[i+1].match(/background-position:-?(\d+)(?:px)?-?(\d+)(?:px)?/);
    const posX = parseInt(m[1]) >>> 5;  // divide by 32 (each flag is 32 pixels wide)
    const posY = parseInt(m[2]) >>> 5;
    const index = posY * 16 + posX;  // image is 16 flags wide
    alpha2ToFlagIndex.set(alpha2.toLowerCase(), index);
}

console.info("// generated with https://github.com/luciopaiva/country-codes");
console.info(`const alpha2ToFlagIndex = new Map([${[...alpha2ToFlagIndex.entries()].map(pair => `["${pair[0]}",${pair[1]}]`)}]);`);
console.info("const flagIndexToBackgroundCoords = (i) => `${-i%16*32}px ${-((i/16)|0)*32}px`;");
