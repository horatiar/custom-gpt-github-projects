
export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GitHub Projects v2 Proxy API",
      description: "Private REST proxy for GitHub Projects v2 via Bearer auth. Owner is fixed to 'horatiar'.",
      version: "1.2.0"
    },
    servers: [
      {
        url: "https://custom-gpt-github-projects.vercel.app/api",
        description: "Live Vercel deployment"
      }
    ],
    security: [{ bearerAuth: [] }],
    paths: {
      "/graphql": {
        post: {
          operationId: "graphql",
          summary: "Run an arbitrary GraphQL query against the GitHub API",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "The GraphQL query or mutation" },
                    variables: { type: "object", description: "The variables for the GraphQL operation" }
                  },
                  required: ["query"]
                }
              }
            }
          },
          responses: {
            "200": { description: "Successful response" }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "token" }
      }
    }
  });
}
