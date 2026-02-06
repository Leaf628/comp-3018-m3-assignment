import { Post } from "../models/postModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
// import { postSchemas } from "../validation/postSchemas";
// import { validateRequest } from "../middleware/validate";

const COLLECTION = "posts";

// creating a new event
type CreatePostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export const createPost = async (postData: CreatePostInput): Promise<Post> => {
    try {
        const newPostData = {
            ... postData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await firestoreRepository.createDocument<Post>(COLLECTION, newPostData);

        return {id, ... newPostData} as Post;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create post: ${errorMessage}`
        );
    }
};
