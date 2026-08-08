"use strict";

const crypto = require("node:crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const database = DynamoDBDocumentClient.from(client);

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}

function readBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}

function removeDatabaseKeys(item) {
  if (!item) {
    return null;
  }

  const { PK, SK, ...record } = item;
  return record;
}

async function listRecords(resource) {
  const result = await database.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `RESOURCE#${resource}`
      }
    })
  );

  return (result.Items || []).map(removeDatabaseKeys);
}

async function createRecord(resource, event) {
  const body = readBody(event);

  if (!body) {
    return createResponse(400, {
      ok: false,
      error: "JSON inválido"
    });
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record = {
    ...body,
    id,
    createdAt: now,
    updatedAt: now
  };

  await database.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `RESOURCE#${resource}`,
        SK: `ITEM#${id}`,
        ...record
      }
    })
  );

  return createResponse(201, record);
}

async function updateRecord(resource, id, event) {
  const body = readBody(event);

  if (!body) {
    return createResponse(400, {
      ok: false,
      error: "JSON inválido"
    });
  }

  const result = await database.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `RESOURCE#${resource}`,
        SK: `ITEM#${id}`
      }
    })
  );

  if (!result.Item) {
    return createResponse(404, {
      ok: false,
      error: "Registro no encontrado"
    });
  }

  const updated = {
    ...removeDatabaseKeys(result.Item),
    ...body,
    id,
    updatedAt: new Date().toISOString()
  };

  await database.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `RESOURCE#${resource}`,
        SK: `ITEM#${id}`,
        ...updated
      }
    })
  );

  return createResponse(200, updated);
}

async function deleteRecord(resource, id) {
  const result = await database.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `RESOURCE#${resource}`,
        SK: `ITEM#${id}`
      }
    })
  );

  if (!result.Item) {
    return createResponse(404, {
      ok: false,
      error: "Registro no encontrado"
    });
  }

  await database.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `RESOURCE#${resource}`,
        SK: `ITEM#${id}`
      }
    })
  );

  return createResponse(200, {
    ok: true,
    deletedId: id
  });
}

async function getDashboard() {
  const customers = await listRecords("customers");
  const services = await listRecords("services");
  const sales = await listRecords("sales");

  return createResponse(200, {
    stats: {
      customers: customers.length,
      services: services.length,
      sales: sales.length
    },
    activities: []
  });
}

exports.handler = async function handler(event) {
  const method = event.httpMethod || "GET";
  const path = event.path || "/";
  const id = event.pathParameters ? event.pathParameters.id : null;

  console.log(
    JSON.stringify({
      message: "Solicitud recibida",
      method,
      path
    })
  );

  try {
    if (method === "GET" && path === "/api/health") {
      return createResponse(200, {
        ok: true,
        service: "IBEX Scenario A API",
        architecture: "serverless",
        database: "dynamodb",
        timestamp: new Date().toISOString()
      });
    }

    if (method === "GET" && path === "/api/dashboard") {
      return await getDashboard();
    }

    const operationalResourceMatch = path.match(
      /^\/api\/(guardians|students|vehicles|projects|tasks|slots|bookings)(?:\/([^/]+))?$/
    );

    if (operationalResourceMatch) {
      const resource = operationalResourceMatch[1];
      const resourceId = operationalResourceMatch[2]
        ? decodeURIComponent(operationalResourceMatch[2])
        : null;

      if (method === "GET" && !resourceId) {
        return createResponse(200, await listRecords(resource));
      }

      if (method === "POST" && !resourceId) {
        return await createRecord(resource, event);
      }

      if (method === "PATCH" && resourceId) {
        return await updateRecord(resource, resourceId, event);
      }

      if (method === "DELETE" && resourceId) {
        return await deleteRecord(resource, resourceId);
      }
    }

    if (method === "GET" && path === "/api/customers") {
      return createResponse(200, await listRecords("customers"));
    }

    if (method === "POST" && path === "/api/customers") {
      return await createRecord("customers", event);
    }

    if (method === "PATCH" && path.startsWith("/api/customers/")) {
      return await updateRecord("customers", id, event);
    }

    if (method === "DELETE" && path.startsWith("/api/customers/")) {
      return await deleteRecord("customers", id);
    }

    if (method === "GET" && path === "/api/services") {
      return createResponse(200, await listRecords("services"));
    }

    if (method === "POST" && path === "/api/services") {
      return await createRecord("services", event);
    }

    if (method === "PATCH" && path.startsWith("/api/services/")) {
      return await updateRecord("services", id, event);
    }

    if (method === "DELETE" && path.startsWith("/api/services/")) {
      return await deleteRecord("services", id);
    }

    if (method === "GET" && path === "/api/sales") {
      return createResponse(200, await listRecords("sales"));
    }

    if (method === "POST" && path === "/api/sales") {
      return await createRecord("sales", event);
    }

    if (method === "PATCH" && path.startsWith("/api/sales/")) {
      return await updateRecord("sales", id, event);
    }

    if (method === "DELETE" && path.startsWith("/api/sales/")) {
      return await deleteRecord("sales", id);
    }

    return createResponse(404, {
      ok: false,
      error: "Ruta no encontrada"
    });
  } catch (error) {
    console.error(error);

    return createResponse(500, {
      ok: false,
      error: "Error interno"
    });
  }
};
