import { IClient } from "../../entities/IClient";
import ClientModel from "../../framework/models/client";
import { IClientRepository } from "../../interfaces/repositories/IClientRepository";

export class ClientRepository implements IClientRepository { 

     async create(client: IClient): Promise<IClient> {
        const newClient= new ClientModel (client);
        return newClient.save();
    } 
    async updateClientDetails(id: string, clientDetails: Partial<IClient>): Promise<IClient | null> {
       return await ClientModel.findByIdAndUpdate(id, clientDetails, { new: true }).exec();  
    }
    
}