import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HB Parking",
      version: "1.0.0",
      description: `HbParking is a parking management platform that allows users to start and manage parking sessions across a set of predefined zones.
                    This API provides full access to the platform's core functionality — querying parking zones and their availability, creating and ending parking sessions, and managing user accounts. It is designed for use by the HbParking mobile and web clients, as well as third-party integrations.
                    All protected endpoints require Bearer token authentication. Tokens are issued upon successful login and must be included in the Authorization header of each request.`,
    },

    servers: [{ url: "http://localhost:8000" }],
  },

  apis: ["./src/routes/*.ts"],
});
