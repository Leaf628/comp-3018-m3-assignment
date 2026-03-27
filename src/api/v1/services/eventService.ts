import { date } from "joi";
import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import  { ValidationError, NotFoundError } from "../errors/AppError";

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
        } else if (trimmedName.length < 5) {
            errors.push("Validation error: \"name\" length must be at least 3 chatacters long.");
        } 
    };

    // Validate event capacity
    if (eventData.capacity !== undefined) {
        
        if (!Number.isInteger(eventData.capacity)) {
            errors.push("Validation error: \"capacity\" must be an integer")
        } else if(eventData.capacity < 5 ){
            errors.push("Validation error: \"capacity\" must be greater than or equal to 5.");
        }     
    };

    // Validate Enum of Status and Category
    if(eventData.status) {
        const validStatuses = ["active", "cancelled", "completed"];
        if (!validStatuses.includes(eventData.status)) {
            errors.push("Validation error: \"status\" must be one of [active, cancelled, completed]")
        }
    };    

    if(eventData.category) {
        const validCategories = ["conference", "workshop", "meetup", "seminar", "general"];
        if (!validCategories.includes(eventData.category)) {
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
        throw new ValidationError(errors.join(","))
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
        // Throw error defined
        if ((error as any ).statusCode) {
            throw error;
        }
        
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create event: ${errorMessage}`
        );
    }
};

// retrieving all events
export const getAllEvents = async (): Promise<{count: number; events: Event[]}> => {
    try {
        const events = await firestoreRepository.getAllDocuments<Event>(COLLECTION);
        return {
            count: events.length,
            events: events
        };
        
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
                `Failed to retrieve all events: ${errorMessage}`
        );
    }
};

// Retrives an event by ID
export const getEventById = async (id: string): Promise<Event> => {
    const event = await firestoreRepository.getDocById<Event>(COLLECTION, id);

    if(!event) {
        throw new NotFoundError(`Event with id ${id} not found`);
    }
    
    return event;
}

// Updating an event
export const updateEvent = async (id: string, eventData: {name: string, date: Date, capacity: number}): Promise<Event> => {
    try {
        // Get an existing event
        const existingEvent = await getEventById(id);

        // Combine the data
        const updatedData = {
            ...existingEvent,
            ...eventData,
            updatedAt: new Date(),
        }

        // validate the data of updating
        validateEventRules(updatedData)

        // update the document
        await firestoreRepository.updateDocument<Event>(
            COLLECTION,
            id,
            updatedData
        );

        // retrieve the updated event document
        const updatedEventData = await firestoreRepository.getDocById<Event>(COLLECTION, id);

        if(!updatedEventData){
            throw new Error("Updated event could not be found");
        }

        return updatedEventData;

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Unknown error occured while updateing event");
    }
};

// deleting an event by ID
export const deleteEvent = async (id: string): Promise<void> => {
   
    await getEventById(id);

    await firestoreRepository.deleteDocument(COLLECTION, id);
};
