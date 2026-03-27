import { Router } from "express";

/**
 * Represents the response structure for a health check endpoint
 */
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}
// Define a route
const router = Router();

// Using the interface to type the response
router.get("/health", (req, res) => {
    // Create a response object that macthes the interface
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };
})
