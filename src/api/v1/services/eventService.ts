import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
// import { eventSchemas } from "../validation/eventSchemas";
// import { validateRequest } from "../middleware/validate";

const COLLECTION = "events";

// Create a function of the rules of validating event
const validateEventRules = (eventData: Partial<Event>): void => {
    const errors: string[] = [];

    // Validate event name
    if (eventData.name !== undefined) {
        // strip the space 
        const trimmedName = eventData.name.trim();

        if (trimmedName.length === 0) {
            errors.push("Validation error: \"name\" is required.");
        } 
        if (trimmedName.length < 3) {
            errors.push("Validation error: \"name\" length must be at least 3 chatacters long.");
        } 
    };

    // Validate event capacity
    if (eventData.capacity !== undefined) {
        if(eventData.capacity < 5 ){
            errors.push("Validation error: \"capacity\" must be greater than or equal to 5.");
        }
        if (!Number.isInteger(eventData.capacity)){
            errors.push("Validation error: \"capacity\" must be an integer")
        }       
    };

    // Validate Enum of Status and Category
    if(eventData.status) {
        const validStatuses = ["active", "cancelled", "completed"];
        if (!validStatuses.includes(eventData.status)){
            errors.push("Validation error: \"status\" must be one of [active, cancelled, completed]")
        }
    };    

    if(eventData.category) {
        const validCategories = ["conference", "workshop", "meetup", "seminar", "general"];
        if (!validCategories.includes(eventData.category)){
            errors.push("Validation error: \"category\" must be one of [conference, workshop, meetup, seminar, general]")
        }
    };

    // Validate the logic between capacity and registration count
    if (
        eventData.registrationCount !== undefined && 
        eventData.capacity !== undefined 
        ) {
        if (eventData.registrationCount > eventData.capacity){
            errors.push ("Validation error: \"registrationCount\" must be less than or equal to ref: capacity.");
        }
    };

    // Validate of event date
    if (eventData.date){
        if(new Date(eventData.date) < new Date) {
            errors.push("Validation error: \"date\" must be greater than \"now\"")
        }
    };

    // Display error message
    if (errors.length > 0) {
        throw new Error(errors[0])
    }
};

// creating a new event
export const createEvent = async (eventData: {name: string; date: Date; capacity: number}): Promise<Event> => {
    try {
        const newEventData = {
            id: "evt_000001",
            ... eventData,
            registrationCount: 0,
            status: "active",
            category: "general",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await firestoreRepository.createDocument<Event>(COLLECTION, newEventData);

        return newEventData;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create event: ${errorMessage}`
        );
    }
};
