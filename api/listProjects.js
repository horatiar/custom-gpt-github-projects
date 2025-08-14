import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { owner } = req.body;
    if (!owner) {
      return res.status(400).json({ error: "Request body must include 'owner'." });
    }
    const graphql = getAuthenticatedClient(req);

    const { user } = await graphql(
      `
        query listProjects($owner: String!) {
          user(login: $owner) {
            projectsV2(first: 20) {
              nodes {
                id
                title
              }
            }
          }
        }
      `,
      { owner }
    );

    res.status(200).json(user.projectsV2.nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}