import { findOneByEmail, registerUser } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ ok: false, message: 'Missing required fields: email, password, name' });
        }

        const user = await findOneByEmail(email);
        if (user && user.email) {
            return res.status(400).json({ ok: false, message: 'Email already exists' });
        }

        const newUser = await registerUser(name, email, password);

        const token = jwt.sign(
            {
                email: newUser.email,
                id: newUser.id, 
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
            token, 
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Server error',
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields: email, password' })
        }
        const { ok, user } = await findOneByEmail(email)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' })
        }
        const token = jwt.sign({
            email: user.email
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        return res.status(200).json({ ok: true, message: token, user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}


export const revalidarToken = async (req, res) => {
    try {
        const email = req.email;

        const { user } = await findOneByEmail(email)

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'User not found',
            });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            ok: true,
            message: token, 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
            },
        });
    } catch (error) {
        console.error('Error revalidating token:', error);
        res.status(500).json({
            ok: false,
            message: 'Internal server error',
        });
    }
};


export const UserController = {
    register,
    login,
    revalidarToken,
}