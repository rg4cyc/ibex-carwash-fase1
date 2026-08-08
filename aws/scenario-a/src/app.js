"use strict";

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function handler(event) {
  const method = event.httpMethod || "GET";
  const path = event.path || "/";

  console.log(
    JSON.stringify({
      level: "INFO",
      message: "Solicitud recibida",
      method,
      path,
      scenario: process.env.SCENARIO_NAME
    })
  );

  if (method === "GET" && path === "/health") {
    return response(200, {
      ok: true,
      service: "IBEX Scenario A API",
      architecture: "serverless",
      services: [
        "API Gateway",
        "Lambda",
        "DynamoDB",
        "CloudWatch"
      ],
      database: "dynamodb",
      tableName: process.env.TABLE_NAME || "local-template",
      timestamp: new Date().toISOString()
    });
  }

  return response(404, {
    ok: false,
    error: "Ruta no encontrada"
  });
};
