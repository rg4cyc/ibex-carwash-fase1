const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/api";
const notificationsUrl = process.env.NOTIFICATIONS_URL || "http://localhost:4010";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
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
  console.log(`BACKEND_URL=${backendUrl}`);
  console.log(`NOTIFICATIONS_URL=${notificationsUrl}`);

  const backendHealth = await request(`${backendUrl}/health`);
  assert(backendHealth.response.ok, `backend health status ${backendHealth.response.status}`);
  assert(backendHealth.data.ok === true, "backend health ok should be true");
  console.log("TEST_1_BACKEND_HEALTH_OK");

  const notificationsHealth = await request(`${notificationsUrl}/health`);
  assert(notificationsHealth.response.ok, `notifications health status ${notificationsHealth.response.status}`);
  assert(notificationsHealth.data.ok === true, "notifications health ok should be true");
  console.log("TEST_2_NOTIFICATIONS_HEALTH_OK");

  const eventPayload = {
    type: "t4.integration",
    title: "Backend integration test",
    message: "Main backend forwarded an event to notifications service",
    entity: {
      project: "ibex-carwash-fase2",
      test: "backend-notifications-integration"
    }
  };

  const notify = await request(`${backendUrl}/t4/notify`, {
    method: "POST",
    body: JSON.stringify(eventPayload)
  });

  assert(notify.response.status === 201 || notify.response.status === 202, `notify status ${notify.response.status}`);
  assert(notify.data.ok === true, "notify ok should be true");
  assert(notify.data.forwardedToNotificationsService === true, "backend should forward to notifications service");
  console.log("TEST_3_BACKEND_FORWARDED_EVENT_OK");

  const list = await request(`${notificationsUrl}/notifications`);
  assert(list.response.ok, `notifications list status ${list.response.status}`);
  assert(Array.isArray(list.data.notifications), "notifications should be array");

  const found = list.data.notifications.some((notification) =>
    notification.type === "t4.integration" &&
    notification.title === "Backend integration test"
  );

  assert(found, "notifications service should contain backend forwarded event");
  console.log("TEST_4_NOTIFICATIONS_RECEIVED_BACKEND_EVENT_OK");

  console.log("BACKEND_NOTIFICATIONS_INTEGRATION_TESTS_OK");
}

main().catch((error) => {
  console.error("BACKEND_NOTIFICATIONS_INTEGRATION_TESTS_FAILED");
  console.error(error.message);
  process.exitCode = 1;
});
