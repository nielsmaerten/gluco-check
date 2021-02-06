// @ts-check
const { readFileSync, writeFileSync } = require("fs");
const { resolve, join } = require("path");
require("dotenv").config();

const nightscoutTestUrl = process.env["NIGHTSCOUT_TEST_URL"];
const nightscoutTestToken = process.env["NIGHTSCOUT_TEST_TOKEN"];
const projectIdProd = process.env["PROJECT_ID_PROD"];
const projectIdNightly = process.env["PROJECT_ID_NIGHTLY"];
const webhookUrlProd = process.env["WEBHOOK_URL_PROD"];
const webhookUrlNightly = process.env["WEBHOOK_URL_NIGHTLY"];
const actionNameProd = process.env["ACTION_NAME_PROD"];
const actionNameNightly = process.env["ACTION_NAME_NIGHTLY"];

const isProd = process.argv[2] === "production";
const projectId = isProd ? projectIdProd : projectIdNightly;
const actionName = isProd ? actionNameProd : actionNameNightly;
const webhookUrl = isProd ? webhookUrlProd : webhookUrlNightly;

const currentDir = resolve(".");
const settingsPath = join(currentDir, "/definitions/settings/settings.yaml");
const settingsContent = readFileSync(settingsPath)
  .toString()
  .replace(/{{projectId}}/g, projectId)
  .replace(/{{actionName}}/g, actionName)
  .replace(/{{nightscoutTestUrl}}/g, nightscoutTestUrl)
  .replace(/{{nightscoutTestToken}}/g, nightscoutTestToken);

const webhookPath = join(currentDir, "/definitions/webhooks/ActionsOnGoogleFulfillment.yaml");
const webhookContent = readFileSync(webhookPath)
  .toString()
  .replace(/{{webhookUrl}}/g, webhookUrl);

writeFileSync(settingsPath, settingsContent, { flag: "w" });
writeFileSync(webhookPath, webhookContent, { flag: "w" });
