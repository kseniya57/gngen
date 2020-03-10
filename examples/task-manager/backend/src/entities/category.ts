import {
    ObjectType,
    InputType,
    Field,
    Int,
    Float
} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable} from 'typeorm';
import {Task} from './task';

@Entity()
@ObjectType()
export class Category {
    @Field(type => Int, { nullable: true })
	@PrimaryGeneratedColumn()
	id: number;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "varchar", length: 32 })
	name: string;
	
	@ManyToMany(type => Task, task => task.categories, { lazy: true })
	@JoinTable()
	@Field(type => [Task])
	tasks: Task[];
}

@InputType()
export class CategoryInput implements Partial<Category> {
    @Field(type => String, { nullable: true })
	name: string;
	
	@Field(type => [Int], { nullable: true })
	taskIds: number[];
}
