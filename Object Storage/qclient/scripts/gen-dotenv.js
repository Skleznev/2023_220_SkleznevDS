const fs = require("fs");
const path = require("path");
const util = require("util");

const files = [
  {
    source: path.join(__dirname, "dotenv", "client.env"),
    target: path.resolve(__dirname, "..", ".env"),
  },
];

async function copy({target, source}) {
  return util.promisify(fs.writeFile)(
    target,
    await util.promisify(fs.readFile)(source),
  );
}

Promise.all(files.map((file) => copy(file))).then();
