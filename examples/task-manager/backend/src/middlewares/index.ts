import session from './session';
import * as Application from 'koa';

export default (app: Application) => {
    session(app);
};
