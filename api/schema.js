export default function handler(req, res) {
  res.status(200).json({
    openapi: "3.1.0",
    info: {
      title: "GitHub Projects v2 GraphQL Proxy",
      description: "A stateless proxy to run GraphQL queries against the GitHub Projects v2 API using Bearer Token authentication.",
      version: "2.0.0"
    },
    servers: [
      {
        url: "https://custom-gpt-github-projects.vercel.app",
        description: "Live Vercel deployment"
      }
    ],
    paths: {
      "/api/github-graphql": {
        post: {
          operationId: "proxyGraphQL",
          summary: "Execute a GitHub GraphQL query",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  "$ref": "#/components/schemas/GraphQLRequest"
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful GraphQL response",
              content: {
                "application/json": {
                  schema: {
                    // Use a reference to the new, more specific response schema
                    "$ref": "#/components/schemas/GraphQLResponse"
                  }
                }
              }
            },
            "401": { description: "Unauthorized. Bearer token is missing or invalid." },
            "405": { description: "Method Not Allowed. Only POST is accepted." },
            "500": { description: "Internal Server Error." }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Your GitHub Personal Access Token (PAT)."
        }
      },
      schemas: {
        GraphQLRequest: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The GraphQL query or mutation string.",
              example: "query { viewer { login } }"
            },
            variables: {
              type: "object",
              additionalProperties: true,
              description: "An object containing variables for the GraphQL query."
            }
          },
          required: ["query"]
        },
        // New schema to define the GraphQL response structure
        GraphQLResponse: {
          type: "object",
          description: "The JSON response from the GitHub GraphQL API.",
          properties: {
            data: {
              type: "object",
              additionalProperties: true,
              description: "The data returned by the successful GraphQL operation."
            },
            errors: {
              type: "array",
              description: "An array of errors that occurred during the operation.",
              items: {
                type: "object",
                additionalProperties: true
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  });
}