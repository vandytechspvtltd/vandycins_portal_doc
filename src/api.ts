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

  // API Request Log
  console.log("========== API REQUEST ==========");
  console.log("URL:", url);
  console.log("METHOD:", options.method || "GET");

  // Password/token ko console me expose nahi karna
  if (options.body) {
    try {
      const body = JSON.parse(options.body as string);

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

    // API Response Log
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
  // Doctor Login
  login: (email: string, password: string) =>
    request("/doctor-portal/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  // Doctor Registration
  register: (data: any) =>
    request("/doctor/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Doctor Profile
  profile: () => request("/doctor/profile"),

  // Doctor Appointments
  appointments: () => request("/doctor/appointments"),

  // Doctor Patients
  patients: () => request("/doctor/patients"),

  // Update Doctor Profile
  updateProfile: (data: any) =>
    request("/doctor/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Update Appointment Status
  appointmentStatus: (id: string, status: string) =>
    request(
      `/doctor/appointments/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    ),
};