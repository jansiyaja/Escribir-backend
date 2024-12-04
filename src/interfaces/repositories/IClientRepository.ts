import { IClient } from "../../entities/IClient";


 


export interface IClientRepository {
    create(user: IClient): Promise<IClient>;
     updateClientDetails(id: string, clientDetails: Partial<IClient>): Promise<IClient | null> 
 }