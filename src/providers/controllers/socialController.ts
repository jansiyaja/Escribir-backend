import { Request, Response } from "express";
import { ISocialController } from "../../interfaces/controllers/ISocialController";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";
import { ISocialUseCase } from "../../interfaces/usecases/ISocialUseCase";
import { BadRequestError } from "../../framework/errors/customErrors";


export class SocialController implements ISocialController {
    constructor(
         private _socialUseCase: ISocialUseCase,
       
    ) { }


   
   
    async followUser(req: Request, res: Response): Promise<void> {

        try {
            const { followingId } = req.params;


            const followerId = (req as any).user.userId;

            const result = await this._socialUseCase.followUser(followerId, followingId);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            logger.error("Error follow user:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }
    }

    async followStatus(req: Request, res: Response): Promise<void> {
        try {
            const { followingId } = req.params;


            const followerId = (req as any).user.userId;


            const followStatus = await this._socialUseCase.getFollowStatus(followerId, followingId);

            res.status(HttpStatusCode.OK).json({ followStatus });
        } catch (error) {
            logger.error("Error getting follow status:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async followAccept(req: Request, res: Response): Promise<void> {

        try {
            const { followingId } = req.params;

            const followerId = (req as any).user.userId;

            const updatedStatus = await this._socialUseCase.followAccept(followerId, followingId);


            res.status(HttpStatusCode.OK).json(updatedStatus);
        } catch (error) {
            logger.error("Error follow user:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }
    }

    async unfollowUser(req: Request, res: Response): Promise<void> {
        try {
            const { followingId } = req.params;
            console.log(followingId);

            const followerId = (req as any).user.userId;

            const result = await this._socialUseCase.unfollowUser(followerId, followingId);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            logger.error("Error unfollow user:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }

    async getFollowers(req: Request, res: Response): Promise<void> {


        try {
            const userId = (req as any).user.userId;
            const followers = await this._socialUseCase.getFollowers(userId);


            res.status(200).json(followers);
        } catch (error) {
            logger.error("Error  in getting followers user:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }
    }

        async searchUser(req: Request, res: Response): Promise<void> {
        const searchQuery = req.query.query;
        const query = searchQuery?.toString()
        if (!query) {
            throw new BadRequestError('please add a valid name')
        }
        const UserId = (req as any).user.userId;
        try {
            const users = await this._socialUseCase.searchUser(UserId, query)


            res.status(HttpStatusCode.OK).json({ users });

        } catch (error) {
            logger.error("Error searching User", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }

    }
    
}