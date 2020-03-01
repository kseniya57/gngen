import * as send from 'koa-send';
import { Context } from 'koa';

export default (ctx: Context, next: Function) => (ctx.params.path === 'graphql' ? next() : send(ctx, 'index.html', { root: '../frontend/dist' }));
