import 'reflect-metadata';
import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as Redis from 'ioredis';
import * as TypeORM from "typeorm";
import { Container } from "typedi";
import { ApolloServer } from 'apollo-server-koa';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema } from 'type-graphql';

import {GRAPHQL_PATH} from './constants';
import applyMiddleware from './middlewares';
import appRoutes from './controllers';

import resolvers from './resolvers';
import entities from './entities';

TypeORM.useContainer(Container);

const app = new Koa();

app.use(cors());

app.use(serve('../frontend/dist'));
app.use(serve('uploads'));

app.use(bodyParser());

app.use(appRoutes);

applyMiddleware(app);

const WEB_PORT = process.env.WEB_PORT || 4000;

const httpServer = app.listen(
    { port: WEB_PORT },
    () => console.log(`🚀 Server ready at http://localhost:${WEB_PORT}/graphql`),
);


const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = +(process.env.REDIS_PORT || 6379);

const options: Redis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: times => Math.max(times * 100, 3000),
};

export const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});

async function bootstrap() {
    await TypeORM.createConnection({
        /* db */
        entities,
        synchronize: true,
        logger: 'advanced-console',
        logging: 'all',
        dropSchema: false,
        cache: true,
    });

    const schema = await buildSchema({
        resolvers,
        validate: false,
        pubSub,
        container: Container,
    });

    const apolloServer = new ApolloServer({
        schema,
    });

    apolloServer.applyMiddleware({ app, path: GRAPHQL_PATH });

    apolloServer.installSubscriptionHandlers(httpServer);
}

bootstrap();

