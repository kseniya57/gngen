import {verify} from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
import {Context} from 'koa';

export default async (ctx: Context | {[index: string]: any}, next: Function) => {
    const {userId} = ctx.session;

    if (!userId) {
        const token = ctx.authorization || ctx.request.header.authorization;
        if (token && token !== 'null') {
            const {id} = (await verify(token, JWT_SECRET) || {}) as { id: number };
            ctx.session.userId = id;
        }
    }

    if (ctx.session.userId && !ctx.session.rights) {
        ctx.session.rights = await getUserRights(ctx.session.userId, 'name').then(pickAll<string>('name'));
        ctx.session.ALL_INCLUSIVE = ctx.session.rights.includes('*');
    }
    ctx.session.ALL_INCLUSIVE = true;

    await next()
}

