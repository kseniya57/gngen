import {verify} from 'jsonwebtoken';
import {Context} from 'koa';
import {getRepository} from 'typeorm';
import { map } from 'lodash';
import { JWT_SECRET } from '../constants';
import { User } from '../entities';

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

        const user = await getRepository(User).findOne({
            where: { id: ctx.session.userId },
            relations: ['rights']
        });

        if (user) {
            ctx.session.rights = map(
                user.rights,
                'name'
            );
            ctx.session.ALL_INCLUSIVE = ctx.session.rights.includes('*');
        }

    }

    await next()
}

