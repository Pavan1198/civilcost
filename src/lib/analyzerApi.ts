const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, "");
const apiKey = import.meta.env.VITE_API_KEY?.trim();

function getBackendUrl() {
  if (!backendUrl) {
    throw new Error(
      "Quote analyzer API is not configured. Add VITE_BACKEND_URL to your .env file.",
    );
  }

  return backendUrl;
}

function getHeaders(extra?: Record<string, string>) {
  return {
    ...(apiKey ? { "x-api-key": apiKey } : {}),
    ...extra,
  };
}

export interface AnalysisResult {
  raw: unknown;
  text: string;
}

export interface RevisedQuoteResult {
  text: string;
  filename: string;
  blob: Blob;
  isPdf: boolean;
}

export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getBackendUrl()}/analyze`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Server error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  return {
    raw: data,
    text: extractText(data),
  };
}

export async function askQuestion(query: string): Promise<string> {
  const response = await fetch(`${getBackendUrl()}/query`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Server error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return extractText(data);
}

export async function generateRevisedQuote(
  file: File,
): Promise<RevisedQuoteResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getBackendUrl()}/generate-quote`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Server error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/pdf")) {
    const blob = await response.blob();
    return {
      text: "Revised quote generated as PDF.",
      filename: "revised_quote.pdf",
      blob,
      isPdf: true,
    };
  }

  let text: string;

  try {
    const data = await response.json();
    text = extractText(data);
  } catch {
    text = await response.text();
  }

  return {
    text,
    filename: "revised_quote.txt",
    blob: new Blob([text], { type: "text/plain;charset=utf-8" }),
    isPdf: false,
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function extractText(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    for (const key of [
      "answer",
      "response",
      "result",
      "message",
      "output",
      "text",
      "content",
    ]) {
      if (typeof record[key] === "string") {
        return record[key] as string;
      }
    }

    return JSON.stringify(data, null, 2);
  }

  return String(data);
}
