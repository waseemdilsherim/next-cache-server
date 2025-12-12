"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// @ts-ignore - serverless-http doesn't have types
const serverless_http_1 = __importDefault(require("serverless-http"));
// Import from local copied file (available after build)
// @ts-ignore - will be available after build script copies it
const app_1 = require("./src/app");
// Export the serverless-wrapped Express app
exports.handler = (0, serverless_http_1.default)(app_1.app);
