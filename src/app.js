"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Create Express app
exports.app = (0, express_1.default)();
// Middleware
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
// Request counter to track API calls
// Note: In serverless, this resets on cold starts
let requestCount = 0;
const requestLogs = [];
// Middleware to log all requests
exports.app.use((req, res, next) => {
    requestCount++;
    const timestamp = new Date().toISOString();
    requestLogs.push({
        timestamp,
        endpoint: req.path,
        count: requestCount,
    });
    console.log(`[${timestamp}] ${req.method} ${req.path} - Total requests: ${requestCount}`);
    next();
});
// Home endpoint - simple health check
exports.app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});
// API endpoint with no cache headers (default)
exports.app.get("/api/data", (req, res) => {
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
exports.app.get("/api/cached", (req, res) => {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
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
exports.app.get("/api/revalidate", (req, res) => {
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
exports.app.get("/api/isr", (req, res) => {
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
exports.app.get("/api/stats", (req, res) => {
    res.json({
        totalRequests: requestCount,
        recentLogs: requestLogs.slice(-20), // Last 20 requests
    });
});
// Reset request counter (for testing)
exports.app.post("/api/reset", (req, res) => {
    requestCount = 0;
    requestLogs.length = 0;
    res.json({
        message: "Request counter reset",
        timestamp: new Date().toISOString(),
    });
});
