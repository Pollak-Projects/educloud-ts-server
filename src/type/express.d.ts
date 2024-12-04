import 'express';

declare module 'express' {
    interface RequestUser extends Request {
        user: any;
    }
}
