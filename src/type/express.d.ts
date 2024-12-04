import 'express';
import { JwtPayload } from 'eduJwt';

declare module 'express' {
    interface RequestUser extends Request {
        token: JwtPayload;
    }
}
