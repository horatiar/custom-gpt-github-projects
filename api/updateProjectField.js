export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { pat, projectId, itemId, fieldId, value } = req.body;

  if (!pat || !projectId || !itemId || !fieldId || !value) {
    return res.status(400).json({ error: 'Missing required fields: pat, projectId, itemId, fieldId, value' });
  }

  const mutation = `
    mutation {
      updateProjectV2ItemFieldValue(input: {
        projectId: "${projectId}",
        itemId: "${itemId}",
        fieldId: "${fieldId}",
        value: {
          singleSelectOptionId: "${value}"
        }
      }) {
        projectV2Item {
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
    body: JSON.stringify({ query: mutation })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  return res.status(200).json(data);
}
