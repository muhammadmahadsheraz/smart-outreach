import { Router } from "express";
import { verifyUser, createUser } from "../lib/userStore";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ ok: false, error: "Missing email or password" });
            return;
        }

        const user = await verifyUser(email, password);
        if (!user) {
            res.status(401).json({ ok: false, error: "Invalid email or password" });
            return;
        }

        // For now we just return a success payload; no real session handling
        res.json({
            ok: true,
            user: { email: user.email, name: user.name, company: user.company },
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, company, password } = req.body;

        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ ok: false, error: "Missing required fields" });
            return;
        }

        const name = `${firstName} ${lastName}`;
        const user = await createUser({ email, name, company, password });

        res.json({ ok: true, user: { email: user.email, name: user.name, company: user.company } });
    } catch (error: any) {
        console.error("Signup error", error);
        if (error.message === "User already exists") {
            res.status(400).json({ ok: false, error: "User already exists" });
            return;
        }
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

export default router;
