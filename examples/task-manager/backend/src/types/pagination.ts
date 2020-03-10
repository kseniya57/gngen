import {
    InputType,
    Field,
    Int,
} from 'type-graphql';
import GraphQLObject from './Object';

@InputType()
export class Pagination {
    @Field(type => Int, { nullable: true })
    skip?: number;

    @Field(type => Int, { nullable: true })
    take?: number;

    @Field(type => GraphQLObject, { nullable: true })
    order?: object;
}
