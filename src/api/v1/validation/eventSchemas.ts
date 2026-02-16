import Joi, { ObjectSchema } from "joi";

// Post operation schemas organized by request part
export const eventSchemas = {
    // POST /events - Create new event
    create: {
        body: Joi.object({
            id: Joi.string().optional(),

            name: Joi.string().required().messages({
                "any.required": "Event name is required",
                "string.empty": "Event name cannot be empty",
            }),
            date: Joi.string().required().messages({
                "any.required": "Date is required",
                "string.empty": "Date cannot be empty",
            }),
            capacity: Joi.number().integer().positive().required().messages({
                "any.required": "Capacity is required",
                "number.base": "Capacity must be a positive integer"
            }),

            status: Joi.string().valid("active", "cancelled", "completed").optional(),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").optional(),
            registrationCount: Joi.number().optional(),
            
        }),
    },


    // GET  /events//: id - Get single event
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required ",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
        query: Joi.object({
            include: Joi.string().valid("name", "status").optional(),
        }),
    },

    // Put /events/:id - Update event
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Event name is required",
                "string.empty": "Event name cannot be empty",
            }),
            date: Joi.string().required().messages({
                "any.required": "Event date is required",
                "string.empty": "Date cannot be empty",
            }),
            capacity: Joi.number().integer().positive().required().messages({
                "any.required": "Event required is required",
                "number.base": "Capacity must be a positive integer"
            }),
            registrationCount: Joi.number().optional().messages({
                "number.base": " Registration count mest be an integer not less than 0",
            }),
            status: Joi.string().valid("active", "cancelled", "completed").optional().messages({
                "string.base": "Status must be one of active, cancelled and completed",
            }),
            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").optional().messages({
                "string.base" : " Category must be one of conference, workshop, meetup, seminar and general",
            }),           
        }),
    },

    //  DELETE /events/:id - Delete event

}