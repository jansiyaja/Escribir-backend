import { Request, Response } from "express";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";
import { ITagController } from "../../interfaces/controllers/ITagController";
import { IBlogUseCase } from "../../interfaces/usecases/IBlogUseCase";


export class TagController implements ITagController {
    constructor(
         private _blogUseCase: IBlogUseCase,
       
    ) { }


   
   


  async listTags(req: Request, res: Response): Promise<void> {
    try {
      logger.info("Fetching all tags");
      const tags = await this._blogUseCase.getAllTags();

      res.status(HttpStatusCode.OK).json(tags);
    } catch (error) {
      logger.error("Error listing tags:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to list tags" });
    }
  }
  async trendTags(req: Request, res: Response): Promise<void> {
    try {
      logger.info("Fetching all tags");
      const tags = await this._blogUseCase.getTrendingTags();

      res.status(HttpStatusCode.OK).json(tags);
    } catch (error) {
      logger.error("Error listing tags:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to list tags" });
    }
  }

  async TagByBlogs(req: Request, res: Response): Promise<void> {
    console.log("Fetching blogs by tag...");

    const { tag } = req.params;
    if (typeof tag !== "string") {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Invalid or missing tag parameter" });
    }

    try {
      const blogs = await this._blogUseCase.getTagBYBlogs(tag);

      res.status(HttpStatusCode.OK).json(blogs);
    } catch (error) {
      logger.error("Error fetching blogs by tag:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to fetch blogs by tag" });
    }
  }

    
}