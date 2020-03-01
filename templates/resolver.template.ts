import {
    Arg,
    Authorized,
    Int,
    Mutation,
    Publisher,
    PubSub,
    Query,
    Resolver,
    Root,
    Subscription,
} from 'type-graphql';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import { filterFields } from '../utils/helpers';
import {$NAME_CAPITALIZED, $NAME_CAPITALIZEDInput} from '../entities/$NAME';
/* import relations */

enum Topic {
    $NAMEAdded = '$NAME_UPPERCASED_ADDED',
    $NAMEUpdated = '$NAME_UPPERCASED_UPDATED',
    $NAMEDeleted = '$NAME_UPPERCASED_DELETED',
}

@Resolver(type => $NAME_CAPITALIZED)
export class $NAME_CAPITALIZEDResolver {

    constructor(
        @InjectRepository($NAME_CAPITALIZED) private readonly $NAMERepository: Repository<$NAME_CAPITALIZED>,
        /* relations repositories */
    ) {}

    @Authorized('READ_$NAME_UPPERCASED')
    @Query(returns => [$NAME_CAPITALIZED], { description: 'Get all $NAME_PLURALIZED' })
    async $NAME_PLURALIZED(): Promise<$NAME_CAPITALIZED[]> {
        return this.$NAMERepository.find()
    }

    /* set relations */

    @Authorized('ADD_$NAME_UPPERCASED')
    @Mutation(returns => Int, { description: 'Add a $NAME' })
    async add$NAME_CAPITALIZED(
        @Arg('input', type => $NAME_CAPITALIZEDInput) input: $NAME_CAPITALIZEDInput,
        @PubSub(Topic.$NAMEAdded) notifyAboutAdded$NAME_CAPITALIZED: Publisher<$NAME_CAPITALIZED>
    ): Promise<number> {
        const $NAME = this.$NAMERepository.create(filterFields<$NAME_CAPITALIZEDInput>(input));
        /* set relations call */
        await this.$NAMERepository.save($NAME);
        notifyAboutAdded$NAME_CAPITALIZED($NAME);
        return $NAME.id;
    }

    @Subscription({
        topics: Topic.$NAMEAdded,
    })
    $NAMEAdded(
        @Root() $NAME: $NAME_CAPITALIZED,
    ): $NAME_CAPITALIZED {
        return $NAME;
    }


    @Authorized('EDIT_$NAME_UPPERCASED')
    @Mutation(returns => Boolean, { description: 'Edit $NAME' })
    async update$NAME_CAPITALIZED(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => $NAME_CAPITALIZEDInput) input: $NAME_CAPITALIZEDInput,
        @PubSub(Topic.$NAMEUpdated) notifyAboutUpdated$NAME_CAPITALIZED: Publisher<$NAME_CAPITALIZED>
    ): Promise<boolean> {
        const $NAME = await this.$NAMERepository.findOne(id);
        if (!$NAME) {
            return false;
        }
        Object.assign($NAME, filterFields(input));
        /* set relations call */
        await this.$NAMERepository.save($NAME);
        notifyAboutUpdated$NAME_CAPITALIZED($NAME);
        return true;
    }

    @Subscription({
        topics: Topic.$NAMEUpdated
    })
    $NAMEUpdated(
        @Root() $NAME: $NAME_CAPITALIZED,
    ): $NAME_CAPITALIZED {
        return $NAME;
    }

    @Authorized('DELETE_$NAME_UPPERCASED')
    @Mutation(returns => Boolean, { description: 'Delete $NAME' })
    async delete$NAME_CAPITALIZED(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.$NAMEDeleted) notifyAboutDeleted$NAME_CAPITALIZED: Publisher<number>
    ): Promise<boolean> {
        const affectedRows = (await this.$NAMERepository.delete(id)).affected || 0;
        if (affectedRows  > 0) {
            notifyAboutDeleted$NAME_CAPITALIZED(id).catch(console.error);
        }
        return affectedRows > 0;
    }

    @Subscription({
        topics: Topic.$NAMEDeleted
    })
    $NAMEDeleted(@Root() id: number): number {
        return id;
    }
}
