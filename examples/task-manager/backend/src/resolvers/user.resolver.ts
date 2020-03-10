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
import {User, UserInput} from '../entities/user';
import {Pagination} from "../types";
import { Task } from '../entities';

enum Topic {
    userAdded = 'USER_ADDED',
    userUpdated = 'USER_UPDATED',
    userDeleted = 'USER_DELETED',
}

@Resolver(type => User)
export class UserResolver {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>
    ) {}

    @Query(returns => [User], { description: 'Get all users' })
    async users(
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<User[]> {
        return this.userRepository.find(pagination)
    }

    async setRelations(user: User, input: UserInput) {
        if (input.taskIds && input.taskIds.length) {
            user.tasks = await this.taskRepository.findByIds(input.taskIds);
        }
    }

    @Mutation(returns => Int, { description: 'Add a user' })
    async addUser(
        @Arg('input', type => UserInput) input: UserInput,
        @PubSub(Topic.userAdded) notifyAboutAddedUser: Publisher<User>
    ): Promise<number> {
        const user = this.userRepository.create(filterFields<UserInput>(input));
        await this.setRelations(user, input);
        await this.userRepository.save(user);
        notifyAboutAddedUser(user);
        return user.id;
    }

    @Subscription({
        topics: Topic.userAdded,
    })
    userAdded(
        @Root() user: User,
    ): User {
        return user;
    }

    @Mutation(returns => Boolean, { description: 'Edit user' })
    async updateUser(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => UserInput) input: UserInput,
        @PubSub(Topic.userUpdated) notifyAboutUpdatedUser: Publisher<User>
    ): Promise<boolean> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            return false;
        }
        Object.assign(user, filterFields(input));
        await this.setRelations(user, input);
        await this.userRepository.save(user);
        notifyAboutUpdatedUser(user);
        return true;
    }

    @Subscription({
        topics: Topic.userUpdated
    })
    userUpdated(
        @Root() user: User,
    ): User {
        return user;
    }

    @Mutation(returns => Boolean, { description: 'Delete user' })
    async deleteUser(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.userDeleted) notifyAboutDeletedUser: Publisher<number>
    ): Promise<boolean> {
        const affectedRows = (await this.userRepository.delete(id)).affected || 0;
        if (affectedRows  > 0) {
            notifyAboutDeletedUser(id).catch(console.error);
        }
        return affectedRows > 0;
    }

    @Subscription({
        topics: Topic.userDeleted
    })
    userDeleted(@Root() id: number): number {
        return id;
    }
}
