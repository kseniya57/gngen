export interface Context {
    session: {
        userId: number,
        ALL_INCLUSIVE: boolean,
        rights: string[]
    }
}
