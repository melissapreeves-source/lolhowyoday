export default async function handler(req, res) {
  // Allow both GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get target from query (GET) or body (POST)
  let target = req.query.target;
  if (!target && req.body) {
    target = req.body.target;
  }
  
  if (!target) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  try {
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://discord.com',
        'Referer': 'https://discord.com/register'
      }
    };

    // If POST, forward the body
    if (req.method === 'POST') {
      fetchOptions.method = 'POST';
      // Remove target from body before forwarding
      const { target, ...forwardData } = req.body;
      fetchOptions.body = JSON.stringify(forwardData);
      fetchOptions.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(target, fetchOptions);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
