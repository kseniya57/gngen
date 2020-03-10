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
import {Category, CategoryInput} from '../entities/category';
import { Task } from '../entities';

enum Topic {
    categoryAdded = 'CATEGORY_ADDED',
    categoryUpdated = 'CATEGORY_UPDATED',
    categoryDeleted = 'CATEGORY_DELETED',
}

@Resolver(type => Category)
export class CategoryResolver {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>
    ) {}

    @Authorized('READ_CATEGORY')
    @Query(returns => [Category], { description: 'Get all categories' })
    async categories(): Promise<Category[]> {
        return this.categoryRepository.find()
    }

    async setRelations(category: Category, input: CategoryInput) {
        if (input.taskIds && input.taskIds.length) {
            category.tasks = await this.taskRepository.findByIds(input.taskIds);
        }
    }

    @Authorized('ADD_CATEGORY')
    @Mutation(returns => Int, { description: 'Add a category' })
    async addCategory(
        @Arg('input', type => CategoryInput) input: CategoryInput,
        @PubSub(Topic.categoryAdded) notifyAboutAddedCategory: Publisher<Category>
    ): Promise<number> {
        const category = this.categoryRepository.create(filterFields<CategoryInput>(input));
        await this.setRelations(category, input);
        await this.categoryRepository.save(category);
        notifyAboutAddedCategory(category);
        return category.id;
    }

    @Subscription({
        topics: Topic.categoryAdded,
    })
    categoryAdded(
        @Root() category: Category,
    ): Category {
        return category;
    }


    @Authorized('EDIT_CATEGORY')
    @Mutation(returns => Boolean, { description: 'Edit category' })
    async updateCategory(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => CategoryInput) input: CategoryInput,
        @PubSub(Topic.categoryUpdated) notifyAboutUpdatedCategory: Publisher<Category>
    ): Promise<boolean> {
        const category = await this.categoryRepository.findOne(id);
        if (!category) {
            return false;
        }
        Object.assign(category, filterFields(input));
        await this.setRelations(category, input);
        await this.categoryRepository.save(category);
        notifyAboutUpdatedCategory(category);
        return true;
    }

    @Subscription({
        topics: Topic.categoryUpdated
    })
    categoryUpdated(
        @Root() category: Category,
    ): Category {
        return category;
    }

    @Authorized('DELETE_CATEGORY')
    @Mutation(returns => Boolean, { description: 'Delete category' })
    async deleteCategory(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.categoryDeleted) notifyAboutDeletedCategory: Publisher<number>
    ): Promise<boolean> {
        const affectedRows = (await this.categoryRepository.delete(id)).affected || 0;
        if (affectedRows  > 0) {
            notifyAboutDeletedCategory(id).catch(console.error);
        }
        return affectedRows > 0;
    }

    @Subscription({
        topics: Topic.categoryDeleted
    })
    categoryDeleted(@Root() id: number): number {
        return id;
    }
}
