// @ts-check
const YAML = require("yamljs");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

glob.sync("**/*.yaml").forEach(yamlFile => {
  const dir = path.dirname(yamlFile);
  const outFile = path.basename(yamlFile, ".yaml") + ".json";
  const outPath = path.join(dir, outFile);
  YAML.load(yamlFile, content => {
    trim(content);
    console.log(yamlFile, '->', outPath);
    fs.writeFileSync(outPath, JSON.stringify(content));
  });
});

// Traverse all (nested) keys in the translation file and trim whitespace
const trim = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      trim(obj[key])
    } else {
      obj[key] = String(obj[key]).trim();
    }
  })
}