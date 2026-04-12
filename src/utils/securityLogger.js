import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * SecurityLogger: Centralized utility for recording security-sensitive events.
 * Stored in Firestore "security_logs" collection for production monitoring.
 */

const logSecurityEvent = async (type, details = {}, level = "INFO") => {
    try {
        const user = auth.currentUser;
        const logData = {
            type,
            level, // INFO, WARNING, CRITICAL
            userId: user ? user.uid : "anonymous",
            userEmail: user ? user.email : "anonymous",
            timestamp: serverTimestamp(),
            path: window.location.pathname,
            userAgent: navigator.userAgent,
            details: {
                ...details,
                // Mask sensitive info if any inadvertently passed
                password: details.password ? "[MASKED]" : undefined
            }
        };

        // Log to console for development visibility
        console.log(`[Security ${level}] ${type}:`, logData);

        // Persistent log in Firestore
        await addDoc(collection(db, "security_logs"), logData);
    } catch (error) {
        // Fail silently to the user, but log to console
        console.error("Critical Security Logging Failure:", error);
    }
};

export const logAuthEvent = (status, provider, error = null) => {
    logSecurityEvent("AUTH_EVENT", {
        status, // SUCCESS, FAILURE, LOGOUT
        provider,
        error: error ? error.message || error : null
    }, error ? "WARNING" : "INFO");
};

export const logSuspiciousActivity = (activityType, details = {}) => {
    logSecurityEvent("SUSPICIOUS_ACTIVITY", {
        activityType, // UNAUTHORIZED_ACCESS_ATTEMPT, RAPID_ACTION, DATA_TAMPERING
        ...details
    }, "CRITICAL");
};

export const logApiError = (error, context = {}) => {
    logSecurityEvent("API_ERROR", {
        errorMessage: error.message || error,
        errorCode: error.code || "unknown",
        ...context
    }, "WARNING");
};

export default {
    logAuthEvent,
    logSuspiciousActivity,
    logApiError
};
