// @ts-ignore - serverless-http doesn't have types
import serverless from "serverless-http";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request counter to track API calls
// Note: In serverless, this resets on cold starts
let requestCount = 0;
const requestLogs: Array<{
  timestamp: string;
  endpoint: string;
  count: number;
}> = [];

// Middleware to log all requests
app.use((req, res, next) => {
  requestCount++;
  const timestamp = new Date().toISOString();
  requestLogs.push({
    timestamp,
    endpoint: req.path,
    count: requestCount,
  });
  console.log(
    `[${timestamp}] ${req.method} ${req.path} - Total requests: ${requestCount}`
  );
  next();
});

// Home endpoint - simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API endpoint with no cache headers (default)
app.get("/api/data", (req, res) => {
  res.json({
    message: "This is uncached data",
    timestamp: new Date().toISOString(),
    requestNumber: requestCount,
    data: {
      id: 1,
      value: Math.random() * 1000,
      description: "This endpoint has no cache headers",
    },
  });
});

// API endpoint with cache headers (for client-side caching)
app.get("/api/cached", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );
  res.json({
    message: "This data has cache headers",
    timestamp: new Date().toISOString(),
    requestNumber: requestCount,
    data: {
      id: 2,
      value: Math.random() * 1000,
      description: "This endpoint sets Cache-Control headers",
    },
  });
});

// API endpoint for testing revalidation
app.get("/api/revalidate", (req, res) => {
  res.json({
    message: "This endpoint is used for revalidation testing",
    timestamp: new Date().toISOString(),
    requestNumber: requestCount,
    data: {
      id: 3,
      value: Math.random() * 1000,
      description: "This data changes on every request",
    },
  });
});

// API endpoint for ISR (Incremental Static Regeneration) testing
app.get("/api/isr", (req, res) => {
  res.json({
    message: "ISR test endpoint",
    timestamp: new Date().toISOString(),
    requestNumber: requestCount,
    data: {
      id: 4,
      value: Math.random() * 1000,
      description: "This endpoint is used for ISR testing",
    },
  });
});

// Get request statistics
app.get("/api/stats", (req, res) => {
  res.json({
    totalRequests: requestCount,
    recentLogs: requestLogs.slice(-20), // Last 20 requests
  });
});

// Reset request counter (for testing)
app.post("/api/reset", (req, res) => {
  requestCount = 0;
  requestLogs.length = 0;
  res.json({
    message: "Request counter reset",
    timestamp: new Date().toISOString(),
  });
});

// Export the serverless-wrapped Express app
export const handler = serverless(app);
