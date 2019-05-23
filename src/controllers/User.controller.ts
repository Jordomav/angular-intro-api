import {
    Get,
    JsonController,
    NotFoundError,
    Post,
    Body,
    Authorized,
    UnauthorizedError,
    CurrentUser
} from "routing-controllers";
import {EntityFromBody, EntityFromParam} from "typeorm-routing-controllers-extensions";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Inject, Service } from "typedi";
import {validate, ValidationError} from "class-validator";

import { User } from "../entity/User";
import { BcryptService } from "../services/bcrypt.service";
import { JwtService } from "../services/jwt.service";

@Service()
@JsonController("/user")
export class UserController {

    @InjectRepository(User)
    private userRepository: Repository<User>;


    @Inject()
    private bcrypt: BcryptService;

    @Inject()
    private jwt: JwtService;


    @Authorized()
    @Get("/")
    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    @Authorized()
    @Get('/currentUser')
    async getCurrentUser(@CurrentUser() currentUser: User): Promise<User> {
        return await currentUser;
    }

    @Authorized()
    @Get("/get/:id")
    async getOne(@EntityFromParam("id") user: User): Promise<User> {
        if (!user) throw new NotFoundError(`User was not found.`);
        return await user;
    }

    @Post('/register')
    async create(@EntityFromBody({ required: true }) newUser: User): Promise<object> {
        const errors: ValidationError[] = await validate(newUser);
        if (errors.length > 0) {
            return await errors.map(({constraints}): object => {
                return {message: constraints[Object.keys(constraints)[0]]};
            });
        }
        newUser.password = await this.bcrypt.genHash(newUser.password).then((hash: string) => hash);
        const user: User = await this.userRepository.save(newUser);
        const token: string = await this.jwt.createToken({user: user.id});
        return {user, token};
    }

    @Post('/login')
    async login(@Body({ required: true }) data): Promise<object>  {
        const user = await this.userRepository.createQueryBuilder("user")
          .where("user.email = :email", { email: data.email })
          .addSelect("user.password").getOne();
        if (!user) throw new NotFoundError(`Email ${data.email} not found!`);
        const isValidated = await this.bcrypt.compare(data.password, user.password);
        if (!isValidated) {
            throw new UnauthorizedError('Password was incorrect')
        } else {
            const token = await this.jwt.createToken({id: user.id});
            return { user, token }
        }
    }
}
