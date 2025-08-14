import { graphql } from '@octokit/graphql';

/**
 * Extracts the Bearer token from the request and creates an authenticated client.
 * @param {import('next').NextApiRequest} req - The incoming API request object.
 * @returns {import('@octokit/graphql').graphql}
 */
export function getAuthenticatedClient(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid Bearer token.');
  }

  const githubPat = authHeader.split(' ')[1];

  return graphql.defaults({
    headers: {
      authorization: `token ${githubPat}`,
    },
  });
}