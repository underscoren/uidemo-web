import "dotenv/config"

import express from "express";
import ViteExpress from "vite-express";
import cookieParser from "cookie-parser";
import { nanoid } from "nanoid";

import { SessionData, createSession, deleteSession, getSession, updateSession } from "./session.ts";
import { createUser, getUserAuth, getUserProfile, verifyUserAuth } from "./db.ts";

declare global {
    namespace Express {
        interface Request {
            userSession?: SessionData
        }
    }
}
const PORT = parseInt(process.env.PORT ?? "3000");

const app = express();
app.use(cookieParser());
app.use(express.json());

/** Custom middleware to test if session exists and is authenticated */
const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionCookie = req.cookies.session;
    if (sessionCookie) {
        const sessionData = await getSession(sessionCookie);
        if(!sessionData)
            return res.status(401).clearCookie("session").json({ error: "Session timed out" });

        req.userSession = sessionData;
        
        return next();
    } else {
        return res.status(401).clearCookie("session").json({ error: "Unauthorized" });
    }
};

/**
 * Register endpoint
 * 
 * Requires a JSON object with the following properties:
 * ```json
 * {
 *  "username": "login username",
 *  "password": "password",
 *  "email": "login email",
 *  "name": "full name",
 *  "subject": "subject",
 *  "university": "university"
 * }
 * ```
 */
app.post("/api/register", async (req, res) => {
    const { username, password, email, name, subject, university } = req.body;
    
    try {
        const user = await createUser(username, password, email, name, subject, university);
        return res.json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Login endpoint
 * 
 * Takes in a JSON object with the following properties:
 * ```json
 * {
 *  username: string,
 *  password: string
 * }
 * 
 * Returns a HTTP 401 on failure with a JSON
 * object containing the error message or a HTTP 200
 * response containing the user id and session id as a
 * JSON object
 */
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await getUserAuth(username);
        if(!user || !user.auth) 
            return res.status(401).json({ error: "Username not found" });

        const passwordCorrect = await verifyUserAuth(password, user.auth.password);
        if(!passwordCorrect)
            return res.status(401).json({ error: "Password incorrect" });

        const sessionID = nanoid();
        await createSession(sessionID, { userID: user.id, count: 0 })
            
        return res.json({ userId: user.id, session: sessionID });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/logout", async (req, res) => {
    const sessionID = req.cookies.session;
    if(!sessionID)
        return res.status(401).json({error: "Session does not exist"});

    try {
        await deleteSession(sessionID);
        return res.json({success: true});
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/** User profile endpoint */

app.get("/api/user", isAuthenticated, async (req, res) => {
    try {
        const userID = req.userSession?.userID;
        if(!userID)
            throw new Error("User session does not contain user id");

        const user = await getUserProfile(userID);
        if(!user || !user.profile)
            throw new Error("User profile does not exist");

        res.json({
            username: user?.username,
            name: user.profile?.name,
            email: user.email,
            university: user.profile.university,
            subject: user.profile.subject,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/api/session", async (req, res) => {
    const sessionID = req.cookies.session;
    if(!sessionID)
        return res.status(401).json({message: "Session does not exist"});
    
    const sessionData = await getSession(sessionID);
    if(!sessionData)
        return res.status(401).json({message: "Session does not exist"});

    return res.json(sessionData);
});


app.post("/api/count", isAuthenticated, async (req, res) => {
    if(!req.userSession)
        return res.status(500).json({ error: "Internal server error" });

    req.userSession.count += 1;
    // console.log("counted!");

    try {
        const sessionID = req.cookies.session
        if(!sessionID)
            throw new Error("Session cookie not present");

        await updateSession(sessionID, req.userSession);
        return res.json({ count: req.userSession.count });
    } catch (error) {
        console.error("Error updaing session");
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


ViteExpress.listen(app, PORT, () => "Server is live on port "+PORT);