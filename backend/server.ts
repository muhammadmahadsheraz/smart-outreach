import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists or is handled by userStore
// userStore handles it relative to process.cwd() called from here

app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
