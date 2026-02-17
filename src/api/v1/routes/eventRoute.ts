import express from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validation/eventSchemas";

const router = express.Router();

router.post("/", validateRequest(eventSchemas.create), eventController.createEventHandler);
router.get("/", eventController.getAllEventsHandler);
router.get("/:id", validateRequest(eventSchemas.getById), eventController.getEventByIdHandler);
router.put("/:id", validateRequest(eventSchemas.update), eventController.updateEventHandler);
router.delete("/:id", validateRequest(eventSchemas.delete), eventController.deleteEventHandler);

export default router;