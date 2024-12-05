import express,{Request,Response} from 'express'
import { adminController } from '../framework/utils/dependencyResolver';
import { authenticateAdminToken, authenticateToken } from '../framework/middleWares/tokenValidator';


export  const adminRouter = express.Router();


adminRouter.get("/test", (req,res) => {
    res.send({message : "uccesfully hosted"})
})
 //---------------------UserRouteHandle---------------------------------------------------------------------------------------------------------------------------//
 
adminRouter.post('/login', (req: Request, res: Response) => adminController.login(req, res));
adminRouter.post('/logout', (req: Request, res: Response) => adminController.logout(req, res));
adminRouter.post('/verify-token',authenticateAdminToken,  (req: Request, res: Response) => adminController.verifyToken(req, res));

adminRouter.get('/users', authenticateToken,(req: Request, res: Response) => adminController.listUsers(req, res))
adminRouter.post('/blockUser',authenticateToken,(req: Request, res: Response) => adminController.blockUser(req, res))
adminRouter.post('/unblockUser',authenticateToken,(req: Request, res: Response) => adminController.unBlockUser(req, res))
//------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------TagRouteHandel--------------------------------------------------------------------------------------------------------------------------//

adminRouter.post('/createtags',authenticateToken,(req: Request, res: Response) => adminController.createTag(req, res))
adminRouter.get('/list-tags',authenticateToken,(req: Request, res: Response) => adminController.listTags(req, res))
adminRouter.put('/update-tag/:tagId', authenticateToken, (req: Request, res: Response) => adminController.updateTag(req, res));
adminRouter.delete('/delete-tag/:tagId', authenticateToken, (req: Request, res: Response) => adminController.deleteTag(req, res));


//------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------------//
adminRouter.get('/list-reportedBlog', authenticateToken, (req: Request, res: Response) => adminController.listOfReports(req, res))
adminRouter.get('/blogs', authenticateToken,(req: Request, res: Response) => adminController.listBlogs(req, res))
//------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------------//
adminRouter.get('/client', authenticateToken,(req: Request, res: Response) => adminController.listClient(req, res))
//------------------------------------------------------------------------------------------------------------------------------------------------//
