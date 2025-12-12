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

let getCounter = 0;
let postCounter = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API endpoint with no cache headers (default)
app.get("/api/get", async (req, res) => {
  getCounter++;
  console.log("calling GET request, counter ------>: ", getCounter);
  await delay(2000);
  res.json({
    message: "This is a get request",
    timestamp: new Date().toISOString(),
    getCounter,
    data: {
      id: 1,
      value: Math.random() * 1000,
      description: "This is a get request",
    },
  });
});

// API endpoint with cache headers (for client-side caching)
app.post("/api/post", async (req, res) => {
  postCounter++;
  console.log("calling POST request, counter ------>: ", postCounter);
  await delay(2000);
  res.json({
    message: "This is a post request",
    timestamp: new Date().toISOString(),
    postCounter,
    data: {
      id: 2,
      value: Math.random() * 1000,
      description: "This is a post request",
    },
  });
});

app.get("/api/reset", (req, res) => {
  getCounter = 0;
  postCounter = 0;
  res.json({
    message: "Request counter reset",
    timestamp: new Date().toISOString(),
  });
});
