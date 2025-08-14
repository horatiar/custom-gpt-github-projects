import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { projectId } = req.body;
    const graphql = getAuthenticatedClient(req);

    const { node } = await graphql(
      `
        query listProjectItems($projectId: ID!) {
          node(id: $projectId) {
            ... on ProjectV2 {
              items(first: 50) {
                nodes {
                  id
                  content {
                    ... on Issue {
                      title
                      url
                    }
                    ... on PullRequest {
                      title
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { projectId }
    );

    res.status(200).json(node.items.nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}