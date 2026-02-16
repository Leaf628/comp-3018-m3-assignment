import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/eventService";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";


// Handles creating new event
export const createEventHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id, name, date, capacity, category, registrationCount, status} = req.body;
        const eventData = {id, name, date, capacity, category, registrationCount, status};

        const newEvent = await eventService.createEvent(eventData);

        res.status(HTTP_STATUS.CREATED).json(successResponse({newEvent}, "Event created"));
    } catch (error: unknown) {
        next(error);
    }
};

// Handles request to get all events
export const getAllEventsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events = await eventService.getAllEvents();

        res.status(HTTP_STATUS.OK).json(successResponse({events}, "Events retrieved successfully"));
    } catch (error: unknown) {
        next(error);
    }
};
