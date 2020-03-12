import {
    Arg,
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
import {Pagination} from "../types";
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

    @Query(returns => [Category], { description: 'Get categories' })
    async categories(
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Category[]> {
        return this.categoryRepository.find(pagination)
    }

    @Query(returns => Int, { description: 'Get categories count' })
    async categoriesCount(): Promise<number> {
        return this.categoryRepository.count()
    }

    async setRelations(category: Category, input: CategoryInput) {
        if (input.taskIds && input.taskIds.length) {
            category.tasks = await this.taskRepository.findByIds(input.taskIds);
        }
    }

    @Mutation(returns => Int, { description: 'Add a category' })
    async addCategory(
        @Arg('input', type => CategoryInput) input: CategoryInput,
        @PubSub(Topic.categoryAdded) onCategoryAdded: Publisher<Category>
    ): Promise<number> {
        const category = this.categoryRepository.create(filterFields<CategoryInput>(input));
        await this.setRelations(category, input);
        await this.categoryRepository.save(category);
        onCategoryAdded(category);
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

    @Mutation(returns => Boolean, { description: 'Edit category' })
    async updateCategory(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => CategoryInput) input: CategoryInput,
        @PubSub(Topic.categoryUpdated) onCategoryUpdated: Publisher<Category>
    ): Promise<boolean> {
        const category = await this.categoryRepository.findOne(id);
        if (!category) {
            return false;
        }
        Object.assign(category, filterFields(input));
        await this.setRelations(category, input);
        await this.categoryRepository.save(category);
        onCategoryUpdated(category);
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

    @Mutation(returns => Boolean, { description: 'Delete category' })
    async deleteCategory(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.categoryDeleted) onCategoryDeleted: Publisher<number>
    ): Promise<boolean> {
        const affectedRows = (await this.categoryRepository.delete(id)).affected || 0;
        if (affectedRows  > 0) {
            onCategoryDeleted(id).catch(console.error);
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
