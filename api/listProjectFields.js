import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { owner, projectId } = req.body;
    if (!owner || !projectId) {
      return res.status(400).json({ error: "Request body must include 'owner' and 'projectId'." });
    }
    const graphql = getAuthenticatedClient(req);

    const { node } = await graphql(
      `
        query listProjectFields($projectId: ID!) {
          node(id: $projectId) {
            ... on ProjectV2 {
              fields(first: 20) {
                nodes {
                  ... on ProjectV2Field {
                    id
                    name
                  }
                  ... on ProjectV2IterationField {
                    id
                    name
                    configuration {
                      iterations {
                        id
                        title
                      }
                    }
                  }
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                    options {
                      id
                      name
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

    res.status(200).json(node.fields.nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}