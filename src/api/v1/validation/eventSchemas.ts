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
}