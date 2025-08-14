import { getAuthenticatedClient } from '../../lib/github';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { githubPat, owner } = req.body;
    const graphql = getAuthenticatedClient(githubPat);

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