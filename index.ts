import dotenv from "dotenv";
import { app } from "./src/app";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Start server for local development
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
