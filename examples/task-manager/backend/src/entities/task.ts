import {
    ObjectType,
    InputType,
    Field,
    Int,
    Float
} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne, JoinTable} from 'typeorm';
import {Category} from './category';
import {User} from './user';

@Entity()
@ObjectType()
export class Task {
    @Field(type => Int, { nullable: true })
	@PrimaryGeneratedColumn()
	id: number;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "varchar", length: 32 })
	name: string;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "text" })
	content: string;
	
	@Field(type => Boolean, { nullable: true })
	@Column({ nullable: true, type: "boolean" })
	done: boolean;
	
	@ManyToMany(type => Category, category => category.tasks, { lazy: true })
	@JoinTable()
	@Field(type => [Category])
	categories: Category[];
	
	@ManyToOne(type => User, user => user.tasks, { lazy: true, onDelete: 'CASCADE' })
	@Field(type => User)
	user: User;
}

@InputType()
export class TaskInput implements Partial<Task> {
    @Field(type => String, { nullable: true })
	name: string;
	
	@Field(type => String, { nullable: true })
	content: string;
	
	@Field(type => Boolean, { nullable: true })
	done: boolean;
	
	@Field(type => [Int], { nullable: true })
	categoryIds: number[];
	
	@Field(type => Int, { nullable: true })
	userId: number;
}
