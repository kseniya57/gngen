import {
    ObjectType,
    InputType,
    Field,
    Int,
    Float
} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity} from 'typeorm';
/* relations */
/* enums */
@Entity()
@ObjectType()
export class $NAME_CAPITALIZED {
    $OBJECT_TYPE_FIELDS
}

@InputType()
export class $NAME_CAPITALIZEDInput implements Partial<$NAME_CAPITALIZED> {
    $INPUT_TYPE_FIELDS
}
