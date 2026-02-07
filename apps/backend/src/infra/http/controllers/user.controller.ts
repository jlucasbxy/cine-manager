import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "@/application/interfaces/services";
import type { CreateUserDTO } from "@repo/dtos";

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly createUserValidator: { parse(data: Record<string, unknown>): CreateUserDTO }
  ) {}

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const data = this.createUserValidator.parse(
      request.body as Record<string, unknown>
    );
    const user = await this.userService.createUser(data);
    return reply.status(201).send(user);
  }
}
