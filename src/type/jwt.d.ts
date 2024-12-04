declare module 'eduJwt' {
    import { RoleEnum } from '../module/role/role.enum';

    export interface JwtPayload {
        sub: string;
        username: string;
        hashedPassword: string;
        userId: string;
        teacherId: string | null;
        roles: RoleEnum[] | null;
    }
}
