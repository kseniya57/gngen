const { JWT_SECRET = 'secret', NODE_ENV = 'development' } = process.env;

export {
    JWT_SECRET,
    NODE_ENV
}

export const GRAPHQL_PATH = '/graphql';
export const UPLOADS_PATH = './uploads';
