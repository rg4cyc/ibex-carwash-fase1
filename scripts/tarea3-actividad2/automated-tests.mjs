const API_BASE_URL = process.env.API_BASE_URL || "https://api-ibex.ccjira.io/api";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { response, data };
}

async function testHealth() {
  const { response, data } = await request("/health");
  assert(response.ok, `Health failed with status ${response.status}`);
  assert(data.ok === true, "Health did not return ok=true");
  assert(data.database === "mongodb", "Health did not report mongodb");
  console.log("TEST_1_HEALTH_OK");
}

async function testDashboardCollections() {
  const { response, data } = await request("/dashboard");
  assert(response.ok, `Dashboard failed with status ${response.status}`);

  const expectedCollections = [
    "clients",
    "guardians",
    "students",
    "vehicles",
    "projects",
    "tasks",
    "slots",
    "bookings",
    "activities"
  ];

  for (const collection of expectedCollections) {
    assert(Array.isArray(data[collection]), `Dashboard missing array: ${collection}`);
  }

  assert(data.clients.length >= 1, "Dashboard should have at least one client");
  assert(data.slots.length >= 1, "Dashboard should have at least one slot");
  assert(data.bookings.length >= 1, "Dashboard should have at least one booking");

  console.log("TEST_2_DASHBOARD_COLLECTIONS_OK");
}

async function testClientCreatePersistenceAndDelete() {
  const suffix = Date.now();
  const payload = {
    name: `QA Temporal ${suffix}`,
    phone: "555-9999",
    email: `qa.${suffix}@example.com`
  };

  const created = await request("/clients", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  assert(
    created.response.ok || created.response.status === 201,
    `Create client failed with status ${created.response.status}`
  );

  assert(created.data && created.data.id, "Created client did not return id");

  const id = created.data.id;

  const afterCreate = await request("/dashboard");
  assert(afterCreate.response.ok, "Dashboard failed after client create");

  const createdIsVisible = afterCreate.data.clients.some((client) => client.id === id);
  assert(createdIsVisible, "Created client is not visible in dashboard");

  const deleted = await request(`/clients/${id}`, {
    method: "DELETE"
  });

  assert(deleted.response.ok, `Delete client failed with status ${deleted.response.status}`);

  const afterDelete = await request("/dashboard");
  assert(afterDelete.response.ok, "Dashboard failed after client delete");

  const stillExists = afterDelete.data.clients.some((client) => client.id === id);
  assert(!stillExists, "Deleted client still exists in dashboard");

  console.log("TEST_3_CLIENT_CREATE_PERSISTENCE_DELETE_OK");
}

async function main() {
  console.log(`API_BASE_URL=${API_BASE_URL}`);
  await testHealth();
  await testDashboardCollections();
  await testClientCreatePersistenceAndDelete();
  console.log("AUTOMATED_TESTS_OK");
}

main().catch((error) => {
  console.error("AUTOMATED_TESTS_FAILED");
  console.error(error.message);
  process.exitCode = 1;
});
