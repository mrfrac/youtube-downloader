import "colors";
import readline from "readline";
import providers from "./providers/index";
import { existsSync, createReadStream } from "fs";
import yargs from "yargs";

const argv = yargs
  .usage("$0 --input <file.txt> --provider <youtube|vimeo>")
  .option("input", {
    alias: "i",
    describe: "input file with line-by-line links",
    demand: true,
    string: true,
    coerce: (input) => {
      if (!existsSync(input)) {
        throw new Error(`Input file "${input}" not found!`.red);
      }
      return input;
    }
  })
  .option("provider", {
    describe: "Video provider (youtube or vimeo)",
    demand: true,
    string: true,
    alias: "p",
    coerce: (param) => {
      const val = String(param).toLowerCase();
      if (!["youtube", "vimeo"].includes(val)) {
        throw new Error("Wrong provider name".red)
      }
      return val;
    }
  })
  .option("out", {
    describe: "Output directory",
    string: true,
    alias: "o",
    coerce: (path) => {
      if (!existsSync(path)) {
        throw new Error(`Output directory "${path}" doesn't exists`.red)
      }
      return path;
    }
  })
  .argv

const readInterface = readline.createInterface({
  input: createReadStream(argv.input),
  output: null,
  console: false
});

const outputDirectory = argv.out || "./";
const providerClass = providers.find(provider => provider.providerName === argv.provider);
const provider = new providerClass();

readInterface.on("line", (url) => {

  provider.download(url, outputDirectory).then(() => {
    console.log("Done".green + ` ${url}`.gray);
  }, (e) => {
    console.log("Error".red + ` ${url} `.gray + String(e).yellow);
  });
});
