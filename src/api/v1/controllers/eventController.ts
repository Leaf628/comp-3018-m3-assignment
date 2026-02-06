import { Request, Response, NextFunction } from "express";
import * as postService from "../services/postService";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// Handles creating new Post
export const createEventHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {userId, content} = req.body;
        const postData = {userId, content};

        const newPost = await postService.createPost(postData);

        res.status(HTTP_STATUS.CREATED).json(successResponse({newPost}, "Post created successfully"));
    } catch (error: unknown) {
        next(error);
    }
};