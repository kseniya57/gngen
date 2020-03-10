import {
    ObjectType,
    InputType,
    Field,
    Int,
    Float
} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn} from 'typeorm';
import {Task} from './task';

@Entity()
@ObjectType()
export class User {
    @Field(type => Int, { nullable: true })
	@PrimaryGeneratedColumn()
	id: number;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "varchar", length: 32 })
	name: string;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: false, type: "varchar", length: 32 })
	email: string;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "varchar", length: 32 })
	password: string;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true, type: "varchar", length: 128 })
	avatar: string;
	
	@OneToMany(type => Task, task => task.user, { lazy: true })
	@JoinColumn()
	@Field(type => [Task])
	tasks: Task[];
}

@InputType()
export class UserInput implements Partial<User> {
    @Field(type => String, { nullable: true })
	name: string;
	
	@Field(type => String, { nullable: false })
	email: string;
	
	@Field(type => String, { nullable: true })
	password: string;
	
	@Field(type => String, { nullable: true })
	avatar: string;
	
	@Field(type => [Int], { nullable: true })
	taskIds: number[];
}
