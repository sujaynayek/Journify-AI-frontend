const API_BASE = "https://journify-ai-backend.onrender.com/api";

/* ─── Auth token helper ───────────────────────────────────────── */
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("journify_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ─── Helper ──────────────────────────────────────────────────── */
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options?.headers,
      },
      ...options,
    });
  } catch (networkErr: any) {
    throw new Error(
      "Cannot connect to the server. Make sure the backend is running."
    );
  }

  // Try to parse JSON; handle cases where body is empty or not JSON
  let json: any;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned an invalid response (status ${res.status}). ` +
      "The backend may be down or MongoDB is not connected."
    );
  }

  if (!res.ok) {
    throw new Error(json.message || json.error || `Request failed (${res.status})`);
  }

  return json.data ?? json;
}

/* ─── Itinerary APIs ──────────────────────────────────────────── */
export interface GenerateParams {
  city: string;
  days: number;
  budget: string;
  interests: string[];
}

export async function generateItinerary(params: GenerateParams) {
  return request<{
    city: string;
    days: number;
    budget: string;
    interests: string[];
    itineraryData: any[];
    costEstimate: any;
    metadata: any;
  }>("/itinerary/generate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getItineraryById(id: string) {
  return request<any>(`/itinerary/${id}`);
}

/* ─── Cost Estimate ───────────────────────────────────────────── */
export async function getCostEstimate(params: {
  city: string;
  days: number;
  budget: string;
  travelers?: number;
}) {
  const query = new URLSearchParams({
    city: params.city,
    days: String(params.days),
    budget: params.budget,
    travelers: String(params.travelers || 1),
  });
  return request<any>(`/itinerary/cost?${query}`);
}

/* ─── Replan ──────────────────────────────────────────────────── */
export async function replanItinerary(params: {
  itineraryId: string;
  days?: number;
  budget?: string;
  interests?: string[];
}) {
  return request<any>("/itinerary/replan", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/* ─── Places Search ───────────────────────────────────────────── */
export async function searchPlaces(params: {
  city: string;
  categories: string[];
  limit?: number;
}) {
  return request<any>("/places/search", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/* ─── Route Optimization ──────────────────────────────────────── */
export async function optimizeRoute(params: {
  coordinates: number[][];
  profile?: string;
}) {
  return request<any>("/route/optimize", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/* ─── Trip APIs (auth required) ───────────────────────────────── */
export async function saveTrip(data: {
  title: string;
  city: string;
  days: number;
  budget: string;
  interests: string[];
  itineraryData: any[];
  costEstimate: any;
  metadata?: any;
}) {
  return request<any>("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTrips(page = 1, limit = 20) {
  return request<any>(`/trips?page=${page}&limit=${limit}`);
}

export async function getTripById(id: string) {
  return request<any>(`/trips/${id}`);
}

export async function deleteTrip(id: string) {
  return request<any>(`/trips/${id}`, { method: "DELETE" });
}

/* ─── AI Enhancement ──────────────────────────────────────────── */
export async function enhanceWithAI(itinerary: any, prompt: string) {
  return request<any>("/ai/customize", {
    method: "POST",
    body: JSON.stringify({ itinerary, prompt }),
  });
}

/* ─── Weather Adaptive ────────────────────────────────────────── */
export async function getWeatherAdaptive(params: {
  city: string;
  itineraryData: any[];
  startDate?: string;
}) {
  return request<any>("/weather/adaptive", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/* ─── Analytics ───────────────────────────────────────────────── */
export async function getAnalyticsStats() {
  return request<any>("/analytics/stats");
}

/* ─── Health Check ────────────────────────────────────────────── */
export async function healthCheck() {
  return request<{ success: boolean; message: string }>("/health");
}
