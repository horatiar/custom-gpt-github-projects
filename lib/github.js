import { graphql } from '@octokit/graphql';

/**
 * Creates a GitHub GraphQL client authenticated with a PAT.
 * @param {string} githubPat - The Personal Access Token from the request.
 * @returns {import('@octokit/graphql').graphql}
 */
export function getAuthenticatedClient(githubPat) {
  if (!githubPat || !githubPat.startsWith('ghp_')) {
    throw new Error('A valid GitHub PAT (starting with ghp_) is required.');
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${githubPat}`,
    },
  });
}