import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "@/application/interfaces/services";
import type {
  CreateUserValidator,
  UpdateUserValidator
} from "@repo/validators";

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly createUserValidator: CreateUserValidator,
    private readonly updateUserValidator: UpdateUserValidator
  ) {}

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const data = this.createUserValidator.parse(request.body);
    const user = await this.userService.createUser(data);
    return reply.status(201).send(user);
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const data = this.updateUserValidator.parse(request.body);
    const user = await this.userService.updateUser(request.userId, data);
    return reply.send(user);
  }
}
