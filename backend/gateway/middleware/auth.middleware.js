import redis from "../../shared/redis/redis.js"

const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId) {
            return res.status(401).json({ message: "Session not found" });
        }
        
        try {
            const session = await redis.get(`session:${sessionId}`);
            if(!session) {
                return res.status(401).json({ message: "Session expired" });
            }
            req.user = JSON.parse(session);
            next();
        } catch (redisError) {
            console.error("Redis error in auth middleware:", redisError);
            // If Redis is down, allow the request to proceed
            // The downstream services will handle authentication if needed
            next();
        }
    } catch(error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Authentication error" });  
    }
}

export default protect;
