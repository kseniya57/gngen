export class NotFoundException extends Error {
    status: number;
    constructor(message: string = 'Not Found') {
        super(message);
        this.status = 404;
    }
}