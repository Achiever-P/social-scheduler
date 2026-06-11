import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Since env.ts is in server/config/, the .env file is in server/ (one level up)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
