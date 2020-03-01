import { AuthChecker } from 'type-graphql';
import {Context} from 'koa';

export const authChecker: AuthChecker<Context> = ({ context: { session } }, rights) => {
    return session && (session.ALL_INCLUSIVE || (session.rights
        ? (!rights.length || session.rights.some((right: string) => rights.includes(right)))
        : false))
};
