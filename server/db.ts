import { PrismaClient } from "@prisma/client"
import { comparePassword, hashPassword } from "./auth.ts";

const prisma = new PrismaClient();

export async function createUser(username: string, password: string, email: string, name: string, subject: string, university: string) {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            username,
            email,
            auth: {
                create: {
                    password: hashedPassword
                }
            },
            profile: {
                create: {
                    name,
                    subject,
                    university,
                }
            }
        }
    });
}

export async function getUserAuth(username: string) {
    return await prisma.user.findFirst({
        where: {
            username
        },
        include: { auth: true }
    });
}

export async function getUserProfile(usernameOrUserID: string | number) {
    if(typeof usernameOrUserID == "number") {
        return await prisma.user.findFirst({
            where: {
                id: usernameOrUserID
            },
            include: { profile: true }
        })
    } else {
        return await prisma.user.findFirst({
            where: {
                username: usernameOrUserID
            },
            include: { profile: true }
        })
    }
}

export async function verifyUserAuth(password: string, hash: string) {
    return await comparePassword(hash, password);
}

export async function checkUser(username: string, password: string) {
    const user =  await prisma.user.findFirst({
        where: {
            username
        },
        include: { auth: true }
    });

    if(!user || !user.auth)
        throw new Error("Username not found");

    return await comparePassword(user.auth.password, password);
}

