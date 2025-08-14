export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { pat, projectId, contentId } = req.body;

  if (!pat || !projectId || !contentId) {
    return res.status(400).json({ error: 'Missing required fields: pat, projectId, contentId' });
  }

  const query = `
    mutation {
      addProjectV2ItemById(input: {
        projectId: "${projectId}",
        contentId: "${contentId}"
      }) {
        item {
          id
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  return res.status(200).json(data);
}
