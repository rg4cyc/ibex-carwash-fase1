const targets = [
  {
    name: "backend_health",
    method: "GET",
    url: process.env.BACKEND_HEALTH_URL || "http://localhost:4000/api/health",
    requests: Number(process.env.HEALTH_REQUESTS || 60),
    concurrency: Number(process.env.HEALTH_CONCURRENCY || 6)
  },
  {
    name: "backend_dashboard",
    method: "GET",
    url: process.env.BACKEND_DASHBOARD_URL || "http://localhost:4000/api/dashboard",
    requests: Number(process.env.DASHBOARD_REQUESTS || 40),
    concurrency: Number(process.env.DASHBOARD_CONCURRENCY || 4)
  },
  {
    name: "notifications_health",
    method: "GET",
    url: process.env.NOTIFICATIONS_HEALTH_URL || "http://localhost:4010/health",
    requests: Number(process.env.NOTIFICATIONS_REQUESTS || 60),
    concurrency: Number(process.env.NOTIFICATIONS_CONCURRENCY || 6)
  },
  {
    name: "backend_to_notifications_event",
    method: "POST",
    url: process.env.BACKEND_NOTIFY_URL || "http://localhost:4000/api/t4/notify",
    requests: Number(process.env.EVENT_REQUESTS || 30),
    concurrency: Number(process.env.EVENT_CONCURRENCY || 3),
    body: {
      type: "t4.performance",
      title: "Performance test event",
      message: "Load test event from scripts/t4/load-test.mjs",
      entity: {
        test: "load",
        source: "scripts/t4/load-test.mjs"
      }
    }
  }
];

const timeoutMs = Number(process.env.LOAD_TEST_TIMEOUT_MS || 7000);

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

async function singleRequest(target, index) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();

  try {
    const response = await fetch(target.url, {
      method: target.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: target.body ? JSON.stringify({
        ...target.body,
        entity: {
          ...(target.body.entity || {}),
          requestIndex: index,
          timestamp: new Date().toISOString()
        }
      }) : undefined,
      signal: controller.signal
    });

    const text = await response.text();
    const durationMs = performance.now() - started;

    return {
      ok: response.ok,
      status: response.status,
      durationMs,
      bytes: text.length,
      error: null
    };
  } catch (error) {
    const durationMs = performance.now() - started;

    return {
      ok: false,
      status: 0,
      durationMs,
      bytes: 0,
      error: error.name === "AbortError" ? "timeout" : error.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function runTarget(target) {
  const started = performance.now();
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < target.requests) {
      const index = nextIndex;
      nextIndex += 1;
      const result = await singleRequest(target, index);
      results.push(result);
    }
  }

  const workers = Array.from(
    { length: Math.min(target.concurrency, target.requests) },
    () => worker()
  );

  await Promise.all(workers);

  const totalDurationMs = performance.now() - started;
  const successful = results.filter((item) => item.ok);
  const failed = results.filter((item) => !item.ok);
  const durations = results.map((item) => item.durationMs);

  return {
    name: target.name,
    method: target.method,
    url: target.url,
    totalRequests: target.requests,
    concurrency: target.concurrency,
    successfulRequests: successful.length,
    failedRequests: failed.length,
    totalDurationMs: Number(totalDurationMs.toFixed(2)),
    requestsPerSecond: Number((target.requests / (totalDurationMs / 1000)).toFixed(2)),
    avgLatencyMs: Number((durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(2)),
    minLatencyMs: Number(Math.min(...durations).toFixed(2)),
    p50LatencyMs: Number(percentile(durations, 50).toFixed(2)),
    p95LatencyMs: Number(percentile(durations, 95).toFixed(2)),
    maxLatencyMs: Number(Math.max(...durations).toFixed(2)),
    errors: failed.slice(0, 5).map((item) => ({
      status: item.status,
      error: item.error
    }))
  };
}

async function main() {
  console.log("IBEX T4 Load Test");
  console.log(`Fecha: ${new Date().toISOString()}`);
  console.log(`Timeout por request: ${timeoutMs} ms`);
  console.log("");

  const summaries = [];

  for (const target of targets) {
    console.log(`RUNNING ${target.name}`);
    const summary = await runTarget(target);
    summaries.push(summary);
    console.log(JSON.stringify(summary, null, 2));
    console.log("");
  }

  const totalRequests = summaries.reduce((sum, item) => sum + item.totalRequests, 0);
  const totalFailed = summaries.reduce((sum, item) => sum + item.failedRequests, 0);

  console.log("SUMMARY");
  console.log(JSON.stringify({
    ok: totalFailed === 0,
    totalTargets: summaries.length,
    totalRequests,
    totalFailed,
    generatedAt: new Date().toISOString()
  }, null, 2));

  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("LOAD_TEST_FATAL_ERROR");
  console.error(error.message);
  process.exitCode = 1;
});
