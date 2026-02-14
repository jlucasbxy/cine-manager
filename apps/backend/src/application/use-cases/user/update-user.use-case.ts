import { Password, Uuid } from "@/domain/value-objects";
import { UserNotFoundError } from "@/domain/errors";
import type { UserRepository } from "@/application/interfaces/repositories";
import type { HashProvider } from "@/application/interfaces/providers";
import { UserMapper } from "@/application/mappers";
import type { UpdateUserDTO, UserDTO } from "@repo/dtos";

export class UpdateUser {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hashProvider: HashProvider
	) {}

	async execute(userId: string, input: UpdateUserDTO): Promise<UserDTO> {
		const id = Uuid.create(userId);
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		const hashedPassword = input.password
			? Password.reconstitute(
					await this.hashProvider.hash(
						Password.create(input.password).toString()
					)
				)
			: undefined;

		await this.userRepository.updateById(id, {
			name: input.name,
			password: hashedPassword
		});

		const updated = await this.userRepository.findById(id);
		return UserMapper.toDTO(updated!);
	}
}
