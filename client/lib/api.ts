const API_BASE = "https://journify-ai-backend.onrender.com/api";

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
        ...options?.headers,
      },
      ...options,
    });
  } catch (networkErr: any) {
    throw new Error(
      "Cannot connect to the server. Make sure the backend is running on port 5000."
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
    itineraryId: string;
    city: string;
    days: number;
    itineraryData: any[];
    costEstimate: any;
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

/* ─── Trip APIs ───────────────────────────────────────────────── */
export async function saveTrip(data: {
  itineraryId: string;
  title: string;
  notes?: string;
}) {
  return request<any>("/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTrips(page = 1, limit = 10) {
  return request<any>(`/trips?page=${page}&limit=${limit}`);
}

export async function getTripById(id: string) {
  return request<any>(`/trips/${id}`);
}

/* ─── AI Enhancement ──────────────────────────────────────────── */
export async function enhanceWithAI(itineraryId: string, prompt: string) {
  return request<any>("/ai/customize", {
    method: "POST",
    body: JSON.stringify({ itineraryId, prompt }),
  });
}

/* ─── Health Check ────────────────────────────────────────────── */
export async function healthCheck() {
  return request<{ success: boolean; message: string }>("/health");
}
