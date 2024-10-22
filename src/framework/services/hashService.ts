
import bcrypt from 'bcrypt'
export interface HashService{
    hash(password:string):Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;

 }
 export class BcryptHashService implements HashService{
  async  hash(password: string): Promise<string> {
        return  await bcrypt.hash(password,10);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password,hash)
    }
 }