const URBA_BASE = "https://api.urba.org.ar/api";

export default async function handler(req: any, res: any) {
  const { id } = req.query;
  try {
    const response = await fetch(`${URBA_BASE}/positions/${id}`);
    if (!response.ok) throw new Error(`URBA API error: ${response.status}`);
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err.message });
  }
}
