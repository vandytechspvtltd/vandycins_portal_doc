const BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/v1"
).replace(/\/$/, "");

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("doctor_access_token");

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${BASE}${path}`;

  console.log("========== API REQUEST ==========");
  console.log("URL:", url);
  console.log("METHOD:", options.method || "GET");

  if (options.body) {
    try {
      const body = JSON.parse(options.body as string);

      // Password console me show nahi karna
      if (body.password) {
        body.password = "***";
      }

      console.log("BODY:", body);
    } catch {
      console.log("BODY:", options.body);
    }
  }

  console.log("=================================");

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text || "Invalid server response",
      };
    }

    console.log("========== API RESPONSE ==========");
    console.log("STATUS:", response.status);
    console.log("OK:", response.ok);
    console.log("DATA:", data);
    console.log("==================================");

    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed (${response.status})`
      );
    }

    return data;
  } catch (error: any) {
    console.error("========== API ERROR ==========");
    console.error("URL:", url);
    console.error("MESSAGE:", error?.message || error);
    console.error("================================");

    throw error;
  }
}

export const api = {
  // =========================
  // DOCTOR LOGIN
  // =========================
  login: (email: string, password: string) =>
    request("/doctor-portal/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  // =========================
  // DOCTOR REGISTRATION
  // =========================
  register: (data: any) =>
    request("/doctor-portal/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // =========================
  // DOCTOR PROFILE
  // =========================
  profile: () =>
    request("/doctor-portal/profile"),

  // =========================
  // DOCTOR STATUS
  // =========================
  status: () =>
    request("/doctor-portal/status"),

  // =========================
  // APPOINTMENTS
  // =========================
  appointments: () =>
    request("/doctor-portal/appointments"),

  // =========================
  // PATIENTS
  // =========================
  patients: () =>
    request("/doctor-portal/patients"),

  // =========================
  // UPDATE PROFILE
  // =========================
  updateProfile: (data: any) =>
    request("/doctor-portal/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // =========================
  // APPOINTMENT STATUS
  // =========================
  appointmentStatus: (
    id: string,
    status: string
  ) =>
    request(
      `/doctor-portal/appointments/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    ),
};