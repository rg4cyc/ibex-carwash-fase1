"use strict";

const assert = require("node:assert");
const { handler } = require("./app");

async function run() {
  const healthResult = await handler({
    httpMethod: "GET",
    path: "/health"
  });

  assert.strictEqual(healthResult.statusCode, 200);

  const healthBody = JSON.parse(healthResult.body);

  assert.strictEqual(healthBody.ok, true);
  assert.strictEqual(healthBody.architecture, "serverless");
  assert.strictEqual(healthBody.database, "dynamodb");

  const invalidResult = await handler({
    httpMethod: "POST",
    path: "/customers",
    body: JSON.stringify({})
  });

  assert.strictEqual(invalidResult.statusCode, 400);

  console.log("SCENARIO_A_BASIC_UNIT_TESTS_OK");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
