import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query, variables } = req.body;

  try {
    const graphql = getAuthenticatedClient(req);
    const data = await graphql(query, variables);
    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}