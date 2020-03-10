import {
    Arg,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';
import { Repository } from "typeorm";
import { has } from 'lodash';
import { InjectRepository } from "typeorm-typedi-extensions";
import {compare} from 'bcrypt'
import {sign, verify} from 'jsonwebtoken'
import {AuthInput, AuthOutput} from '../types';
import {User} from '../entities/user';
import {JWT_SECRET} from '../constants';
import {NotFoundException} from "../exceptions";

@Resolver()
export class AuthResolver {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    @Mutation(returns => AuthOutput)
    async login(
        @Arg('input', type => AuthInput) input: AuthInput,
    ): Promise<AuthOutput> {
        const user = await this.userRepository.findOne({ where: { email: input.email } });

        if (!user) {
            throw new Error('User with this email does not exist');
        }

        const isValid = input.password && user.password && await compare(input.password, user.password);

        if (!isValid) {
            throw new Error('Incorrect password');
        }

        const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

        return {
            token,
            user,
        };
    }

    @Query(returns => AuthOutput)
    async check(@Arg('token', type => String) token: string): Promise<AuthOutput | null> {
        const userData = (await verify(token, JWT_SECRET)) as { id: number };

        if (!has(userData, 'id')) {
            throw new NotFoundException('Your token expired');
        }

        return {
            token,
            user: await this.userRepository.findOne(userData.id),
        }
    }
}
