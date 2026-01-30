import z from "zod"

class UUIDValidator {
    parse(uuid: string) {
        return z.uuidv7().safeParse(uuid)
    }
}

export const uuidValidator = new UUIDValidator()
