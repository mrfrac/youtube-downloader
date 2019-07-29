/**
 * @todo:
 *  - CL arguments (yargs);
 *  - Error handling;
 *  - Tests;
 *  - Promise-based downloading;
 *  - Documentation.
 */

require("colors");
const readline = require("readline");
const cheerio = require("cheerio");
const request = require("request");
const ytdl = require('ytdl-core');
const { existsSync, createReadStream, createWriteStream } = require("fs");

if (!existsSync("./input.txt")) throw new Error("input.txt not found");

const readInterface = readline.createInterface({
    input: createReadStream("./input.txt"),
    output: null,
    console: false
});

readInterface.on("line", function(url) {
    request(url, (error, response, body) => {
        console.log(` => ${url}`.green);
        if (error) {
            console.log(` Error: ${error}.red`);
        }
        const html = cheerio.load(body);
        const title = html("title").text().replace(/\r?\n|\r/g, '');
        console.log(` Title: ${title}`);
        ytdl(url, { filter: (format) => format.container === 'mp4' })
            .pipe(createWriteStream(`${title}.mp4`));
    });
});