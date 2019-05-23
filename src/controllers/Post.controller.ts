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
import { Service } from "typedi";

@Service()
@JsonController("/post")
export class PostController {

}
