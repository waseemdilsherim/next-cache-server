// @ts-ignore - serverless-http doesn't have types
import serverless from "serverless-http";
// @ts-ignore - will be available after build
import { app } from "../../dist/src/app";

// Export the serverless-wrapped Express app
export const handler = serverless(app);
