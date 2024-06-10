import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Employer, JobSeeker } from '../models/user.js';

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { email, password, userType, country, city, about, ...rest } = req.body;

        // Проверка наличия пользователя с таким email
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Проверка обязательных полей
        if (!country || !city || !about) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание пользователя на основе типа
        let user;
        if (userType === 'Employer') {
            user = new Employer({ email, password: hashedPassword, country, city, about, ...rest });
        } else if (userType === 'JobSeeker') {
            user = new JobSeeker({ email, password: hashedPassword, country, city, about, ...rest });
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        await user.save();

        // Создание JWT токена
        const token = jwt.sign({
            userId: user._id,
            userType: user.userType
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
});

// Логин пользователя
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Поиск пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Создание JWT токена
        const token = jwt.sign({
            userId: user._id,
            userType: user.userType
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Получение информации о пользователе по userId
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
