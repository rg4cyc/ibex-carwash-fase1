"use strict";

const assert = require("node:assert");
const { handler } = require("./app");

async function run() {
  const health = await handler({
    httpMethod: "GET",
    path: "/api/health",
    pathParameters: null
  });

  assert.strictEqual(health.statusCode, 200);

  const healthBody = JSON.parse(health.body);

  assert.strictEqual(healthBody.ok, true);
  assert.strictEqual(healthBody.database, "dynamodb");

  const missingRoute = await handler({
    httpMethod: "GET",
    path: "/api/unknown",
    pathParameters: null
  });

  assert.strictEqual(missingRoute.statusCode, 404);

  console.log("SCENARIO_A_EXPLICIT_ROUTES_TEST_OK");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
