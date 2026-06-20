export async function parseJsonResponse<T = Record<string, unknown>>(
  response: Response
): Promise<T> {
  const text = await response.text();
  if (!text.trim()) {
    throw new Error("Empty response from server");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid response from server");
  }
}
