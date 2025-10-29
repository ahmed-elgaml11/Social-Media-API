export interface IUserPaylod {
    id: string,
    name: string,
    email: string,
    role: IRole
}

declare type IRole = 'admin' | 'user'
declare global {
  namespace Express {
    interface Request {
        user?: IUserPaylod
    }
  }
}