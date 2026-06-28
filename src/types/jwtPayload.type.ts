import { Types } from 'mongoose';

export interface JwtPayload {
  id: Types.ObjectId;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}
