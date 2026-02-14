import type { CreateGraphResponse, GraphJobResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function createGraph(
  transcript: string,
): Promise<CreateGraphResponse> {
  const res = await fetch(`${BASE_URL}/api/graphs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function getGraphJob(jobId: string): Promise<GraphJobResponse> {
  const res = await fetch(`${BASE_URL}/api/graphs/${jobId}`);
  if (res.status === 404) throw new Error("Job not found");
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
