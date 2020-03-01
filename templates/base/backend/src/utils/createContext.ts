import auth from '../middlewares/auth'
import { Context } from 'koa';

export default async ({ ctx = {}, connection }: { ctx: Context | {[index: string]: any}, connection: Context }) => {
    if (connection) {
        const { context = {}, authorization } = connection;

        if (!authorization || (context.session && context.session.userId)) {
            return context;
        } if (authorization) {
            Object.assign(ctx, context);
            ctx.session = ctx.session || {};
            ctx.authorization = authorization;
            await auth(ctx, () => null);
        }
    }

    return ctx;
};
