import { UserDocument } from '../db/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
