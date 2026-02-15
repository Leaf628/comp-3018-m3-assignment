import Joi, { ObjectSchema } from "joi";

// Post operation schemas organized by request part
export const eventSchemas = {
    // POST /posts - Create new post
    create: {
        body: Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "Event ID is required",
                "string.empty": "Event ID cannot be empty",
            }),
            content: Joi.string().required().messages({
                "any.required": "Date is required",
                "string.empty": "Date cannot be empty",
            }),
        }),
    },
}