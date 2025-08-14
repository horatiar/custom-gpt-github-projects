import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { githubPat, projectId, contentId } = req.body;
    const graphql = getAuthenticatedClient(githubPat);

    const { addProjectV2ItemById } = await graphql(
      `
        mutation addItemToProject($projectId: ID!, $contentId: ID!) {
          addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
            item {
              id
            }
          }
        }
      `,
      { projectId, contentId }
    );

    res.status(200).json(addProjectV2ItemById.item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}