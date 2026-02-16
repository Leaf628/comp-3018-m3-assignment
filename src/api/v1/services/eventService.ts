import { date } from "joi";
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
        } else if (trimmedName.length < 3) {
            errors.push("Validation error: \"name\" length must be at least 3 chatacters long.");
        } 
    };

    // Validate event capacity
    if (eventData.capacity !== undefined) {
        
        if (!Number.isInteger(eventData.capacity)){
            errors.push("Validation error: \"capacity\" must be an integer")
        } else if(eventData.capacity < 5 ){
            errors.push("Validation error: \"capacity\" must be greater than or equal to 5.");
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
       const eventDate = new Date(eventData.date);
       const now = new Date();

       if (isNaN(eventDate.getTime())) {
        errors.push("Validation error: date must be a valide date format");
       } else if (eventDate.getTime() <= now.getTime()) {
        errors.push("Validation error: \"date\" must be greater than \"now\"");
       }
    };

    // Display error message
    if (errors.length > 0) {
        throw new Error(errors.join(","))
    }
};

// creating a new event
export const createEvent = async (eventData: {
    id?: string;
    name: string; 
    date: Date | string; 
    capacity: number;
    registrationCount?: number;
    status?: string;
    category?: string; 
}): Promise<Event> => {
    try {     
        // Use ID inputted
        const eventID = eventData.id || `evt_${Math.random().toString(36).slice(2, 11)}`;
        
        // Get data of new event
        const newEventData = {
            id: eventID,
            name: eventData.name,
            date: new Date(eventData.date),
            capacity: eventData.capacity,
            registrationCount: eventData.registrationCount || 0,
            status: eventData.status || "active",
            category: eventData.category || "general",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Validate all rules of creating an event
        validateEventRules(newEventData);

        // Create the document of firebase
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

// retrieving all events

