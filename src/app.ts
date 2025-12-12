import express from "express";
import cors from "cors";

// Create Express app
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home endpoint - simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API endpoint with no cache headers (default)
app.get("/api/get", async (req, res) => {
  console.log("calling GET request");
  await delay(2000);
  res.json({
    message: "This is a get request",
    timestamp: new Date().toISOString(),
    data: {
      id: 1,
      value: Math.random() * 1000,
      description: "This is a get request",
    },
  });
});

// API endpoint with cache headers (for client-side caching)
app.post("/api/post", async (req, res) => {
  console.log("calling POST request");
  await delay(2000);
  res.json({
    message: "This is a post request",
    timestamp: new Date().toISOString(),
    data: {
      id: 2,
      value: Math.random() * 1000,
      description: "This is a post request",
    },
  });
});
