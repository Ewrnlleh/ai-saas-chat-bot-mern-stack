import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash } from "bcrypt";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const hashedPassword = hash(password, 10); 
        const users = new User({ name, email, password: hashedPassword });
        await users.save();
        return res.status(200).json({ message: "OK", id: users._id.toString() });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};