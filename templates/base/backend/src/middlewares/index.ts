import session from './session';
import auth from './auth';
import * as Application from 'koa';

export default (app: Application) => {
    session(app);

    [auth]
        .forEach(middleware => app.use(middleware));
};
