const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export async function importCsvRows(rows) {
  const response = await fetch(`${BACKEND_URL}/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rows }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.statusText} (${response.status})`);
  }

  return await response.json();
}
