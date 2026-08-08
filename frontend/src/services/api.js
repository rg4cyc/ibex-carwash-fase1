const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function apiResource(resource) {
  const resourceMap = {
    clients: "customers"
  };

  return resourceMap[resource] || resource;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Error en la solicitud");
  }

  return data;
}

export function getDashboard() {
  return request("/dashboard");
}

export function listResource(resource) {
  return request(`/${apiResource(resource)}`);
}

export function createResource(resource, payload) {
  return request(`/${apiResource(resource)}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateResource(resource, id, payload) {
  return request(`/${apiResource(resource)}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteResource(resource, id) {
  return request(`/${apiResource(resource)}/${id}`, {
    method: "DELETE"
  });
}
