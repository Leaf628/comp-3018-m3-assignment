import { Request, Response, NextFunction } from "express";
import * as postService from "../services/postService";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Event } from "../models/eventModel";

// Handles creating new Post
export const createPostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {name, date, capacity, category, registrationCount, status} = req.body;
        const postData = {name, date, capacity, category, registrationCount, status};

        const newPost = await postService.createPost(postData);

        res.status(HTTP_STATUS.CREATED).json(successResponse({newPost}, "Post created successfully"));
    } catch (error: unknown) {
        next(error);
    }
};