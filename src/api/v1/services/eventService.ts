import { Post } from "../models/postModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
// import { postSchemas } from "../validation/postSchemas";
// import { validateRequest } from "../middleware/validate";

const COLLECTION = "events";

// creating a new event
type CreateEventInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export const createEvent = async (eventData: CreateEventInput): Promise<Post> => {
    try {
        const newEventData = {
            ... eventData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await firestoreRepository.createDocument<Post>(COLLECTION, newEventData);

        return {id, ... newEventData} as Post;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create post: ${errorMessage}`
        );
    }
};
