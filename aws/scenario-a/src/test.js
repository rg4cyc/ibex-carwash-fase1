"use strict";

const assert = require("node:assert");
const { handler } = require("./app");

async function run() {
  const result = await handler({
    httpMethod: "GET",
    path: "/health"
  });

  assert.strictEqual(result.statusCode, 200);

  const body = JSON.parse(result.body);

  assert.strictEqual(body.ok, true);
  assert.strictEqual(body.architecture, "serverless");
  assert.strictEqual(body.database, "dynamodb");

  console.log("SCENARIO_A_HEALTH_UNIT_TEST_OK");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
