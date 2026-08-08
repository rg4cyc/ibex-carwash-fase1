"use strict";

const crypto = require("node:crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

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

function parseBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}

async function createCustomer(event) {
  const body = parseBody(event);

  if (!body) {
    return response(400, {
      ok: false,
      error: "El cuerpo debe contener JSON válido"
    });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();

  if (!name || !email) {
    return response(400, {
      ok: false,
      error: "name y email son obligatorios"
    });
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const customer = {
    id,
    name,
    email,
    createdAt
  };

  await dynamo.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: "RESOURCE#customers",
        SK: `ITEM#${id}`,
        entityType: "customer",
        ...customer
      }
    })
  );

  console.log(
    JSON.stringify({
      level: "INFO",
      message: "Cliente creado",
      customerId: id
    })
  );

  return response(201, {
    ok: true,
    customer
  });
}

async function listCustomers() {
  const result = await dynamo.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "RESOURCE#customers"
      }
    })
  );

  const customers = (result.Items || []).map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    createdAt: item.createdAt
  }));

  return response(200, {
    ok: true,
    count: customers.length,
    customers
  });
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

  try {
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

    if (method === "GET" && path === "/customers") {
      return await listCustomers();
    }

    if (method === "POST" && path === "/customers") {
      return await createCustomer(event);
    }

    return response(404, {
      ok: false,
      error: "Ruta no encontrada"
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        message: error.message
      })
    );

    return response(500, {
      ok: false,
      error: "Error interno"
    });
  }
};
