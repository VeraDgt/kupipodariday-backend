import { User } from "src/users/entities/user.entity";

export interface IUserReq extends Request {
  user: User;
}