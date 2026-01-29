export interface IUserPaylod {
    id: string,
    name: string,
    email: string,
    role: IRole,
    isActive: boolean
}

declare type IRole = 'admin' | 'user'

declare type IPrivacy = 'private' | 'public' | 'friends'

declare type IReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'

declare type IFriendRequestType = 'accept' | 'reject' | 'pending'

declare type INotificationType = 'friend_request' | 'comment' | 'reaction'

declare global {
  namespace Express {
    interface Request {
        user?: IUserPaylod
    }
  }
}



