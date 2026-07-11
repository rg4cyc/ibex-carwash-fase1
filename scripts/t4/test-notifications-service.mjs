const baseUrl = process.env.NOTIFICATIONS_URL || "http://localhost:4010";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
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

async function main() {
  console.log(`NOTIFICATIONS_URL=${baseUrl}`);

  const health = await request("/health");
  assert(health.response.ok, `health status ${health.response.status}`);
  assert(health.data.ok === true, "health ok should be true");
  console.log("TEST_1_NOTIFICATIONS_HEALTH_OK");

  const created = await request("/events", {
    method: "POST",
    body: JSON.stringify({
      type: "qa.t4",
      title: "T4 test event",
      message: "Notification service receives events correctly",
      source: "scripts/t4/test-notifications-service.mjs",
      entity: {
        project: "ibex-carwash-fase2"
      }
    })
  });

  assert(created.response.status === 201, `create status ${created.response.status}`);
  assert(created.data.ok === true, "created ok should be true");
  assert(created.data.notification.id, "created notification should have id");
  console.log("TEST_2_NOTIFICATIONS_CREATE_EVENT_OK");

  const list = await request("/notifications");
  assert(list.response.ok, `list status ${list.response.status}`);
  assert(list.data.ok === true, "list ok should be true");
  assert(Array.isArray(list.data.notifications), "notifications should be array");
  assert(list.data.notifications.length >= 1, "notifications should include created event");
  console.log("TEST_3_NOTIFICATIONS_LIST_OK");

  console.log("NOTIFICATIONS_SERVICE_TESTS_OK");
}

main().catch((error) => {
  console.error("NOTIFICATIONS_SERVICE_TESTS_FAILED");
  console.error(error.message);
  process.exitCode = 1;
});
