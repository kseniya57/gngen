import session from './session';
import * as Application from 'koa';

export default (app: Application) => {
    session(app);

    // add middlewares here
    [].forEach(middleware => app.use(middleware));
};
