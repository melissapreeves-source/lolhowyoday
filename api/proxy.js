export default async function handler(req, res) {
  // Only allow POST requests for registration
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const target = req.query.target || req.body.target;
  
  if (!target) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    // Forward the entire request body EXCEPT the target field
    const { target: _, ...forwardData } = req.body;
    
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://discord.com',
        'Referer': 'https://discord.com/register'
      },
      body: JSON.stringify(forwardData)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
