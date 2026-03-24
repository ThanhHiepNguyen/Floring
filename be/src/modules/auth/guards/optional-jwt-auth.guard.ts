import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = unknown>(err: unknown, user: TUser) {
        if (err) return null;
        return (user ?? null) as TUser;
    }

  
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
        const authHeader = req.headers?.authorization;
        if (!authHeader) return true;
        return super.canActivate(context);
    }
}

