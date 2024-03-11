import bcrypt from "bcrypt";

// The more salt rounds, the longer hashing takes
const saltRounds = 10;

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(hash: string, password: string) {
    return await bcrypt.compare(password, hash);
}

