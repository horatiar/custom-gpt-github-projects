import { getAuthenticatedClient } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Note: 'value' can be a string, number, or an object for different field types.
    const { githubPat, projectId, itemId, fieldId, value } = req.body;
    const graphql = getAuthenticatedClient(githubPat);

    const { updateProjectV2ItemFieldValue } = await graphql(
      `
        mutation updateField(
          $projectId: ID!
          $itemId: ID!
          $fieldId: ID!
          $value: ProjectV2FieldValue!
        ) {
          updateProjectV2ItemFieldValue(
            input: {
              projectId: $projectId
              itemId: $itemId
              fieldId: $fieldId
              value: $value
            }
          ) {
            projectV2Item {
              id
            }
          }
        }
      `,
      {
        projectId,
        itemId,
        fieldId,
        value: { singleSelectOptionId: value }, // This structure changes based on field type!
      }
    );

    res.status(200).json(updateProjectV2ItemFieldValue.projectV2Item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}