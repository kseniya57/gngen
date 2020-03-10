import {Field, InputType, ObjectType} from 'type-graphql';
import {User} from '../entities/user';

@InputType()
export class AuthInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@ObjectType()
export class AuthOutput {
    @Field({ nullable: true })
    token?: string;

    @Field({ nullable: true })
    user?: User;
}
