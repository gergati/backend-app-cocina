import prisma from "../database/connection.database.js";
import bcryptjs from 'bcryptjs'


export const registerUser = async (name, email, password) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase(),
                password: bcryptjs.hashSync(password)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
        return user
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }

}

export const findOneByEmail = async (email) => {
    try {
        const userByEmail = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true
            }
        })
        if (!userByEmail) {
            return {
                ok: false,
                message: 'User not found'
            };
        }

        return {
            ok: true,
            user: userByEmail
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Error'
        }
    }
}

