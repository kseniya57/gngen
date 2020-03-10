import * as bodyParser from 'koa-body';
import { UPLOADS_PATH } from '../constants';
import {Context} from 'koa';

export default [
    bodyParser({
        formidable: {
            uploadDir: UPLOADS_PATH,
            onFileBegin: (name, file) => {
                const ext = file.name.match(/(.*)\.(.*)/)[2];
                const dir = file.type.startsWith('image') ? 'images/' : 'files/';

                file.path = `${file.path.replace('upload_', dir)}.${ext}`;
            },
        },
        multipart: true,
        urlencoded: true,
    }),
    (ctx: Context) => {
        if (!ctx.request.files) {
            throw new Error('No files in request')
        }
        ctx.body = {
            error: false,
            fileName: ctx.request.files.file.path.replace(/^uploads/, ''),
        };
    },
];
