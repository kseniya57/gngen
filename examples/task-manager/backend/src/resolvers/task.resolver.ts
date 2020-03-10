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
import {Task, TaskInput} from '../entities/task';
import { Category, User } from '../entities';

enum Topic {
    taskAdded = 'TASK_ADDED',
    taskUpdated = 'TASK_UPDATED',
    taskDeleted = 'TASK_DELETED',
}

@Resolver(type => Task)
export class TaskResolver {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
		@InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    @Authorized('READ_TASK')
    @Query(returns => [Task], { description: 'Get all tasks' })
    async tasks(): Promise<Task[]> {
        return this.taskRepository.find()
    }

    async setRelations(task: Task, input: TaskInput) {
        if (input.categoryIds && input.categoryIds.length) {
            task.categories = await this.categoryRepository.findByIds(input.categoryIds);
        }
		if (input.userId) {
            const user = await this.userRepository.findOne({ where: { id: input.userId } });
            if (user) {
                task.user = user;
            }
        }
    }

    @Authorized('ADD_TASK')
    @Mutation(returns => Int, { description: 'Add a task' })
    async addTask(
        @Arg('input', type => TaskInput) input: TaskInput,
        @PubSub(Topic.taskAdded) notifyAboutAddedTask: Publisher<Task>
    ): Promise<number> {
        const task = this.taskRepository.create(filterFields<TaskInput>(input));
        await this.setRelations(task, input);
        await this.taskRepository.save(task);
        notifyAboutAddedTask(task);
        return task.id;
    }

    @Subscription({
        topics: Topic.taskAdded,
    })
    taskAdded(
        @Root() task: Task,
    ): Task {
        return task;
    }


    @Authorized('EDIT_TASK')
    @Mutation(returns => Boolean, { description: 'Edit task' })
    async updateTask(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => TaskInput) input: TaskInput,
        @PubSub(Topic.taskUpdated) notifyAboutUpdatedTask: Publisher<Task>
    ): Promise<boolean> {
        const task = await this.taskRepository.findOne(id);
        if (!task) {
            return false;
        }
        Object.assign(task, filterFields(input));
        await this.setRelations(task, input);
        await this.taskRepository.save(task);
        notifyAboutUpdatedTask(task);
        return true;
    }

    @Subscription({
        topics: Topic.taskUpdated
    })
    taskUpdated(
        @Root() task: Task,
    ): Task {
        return task;
    }

    @Authorized('DELETE_TASK')
    @Mutation(returns => Boolean, { description: 'Delete task' })
    async deleteTask(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.taskDeleted) notifyAboutDeletedTask: Publisher<number>
    ): Promise<boolean> {
        const affectedRows = (await this.taskRepository.delete(id)).affected || 0;
        if (affectedRows  > 0) {
            notifyAboutDeletedTask(id).catch(console.error);
        }
        return affectedRows > 0;
    }

    @Subscription({
        topics: Topic.taskDeleted
    })
    taskDeleted(@Root() id: number): number {
        return id;
    }
}
