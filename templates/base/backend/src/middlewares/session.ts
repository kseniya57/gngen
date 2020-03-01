import * as session from 'koa-session';
import * as Application from 'koa';

export default (app: Application) => {
    app.keys = ['key'];
    app.use(session({}, app));
};
