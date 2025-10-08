import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-managers.js";
import { COOKIE_NAME } from "../utils/constants.js";

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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send({ message: "User already exists" });
        }
        const hashedPassword = await hash(password, 10); 
        const users = new User({ name, email, password: hashedPassword });
        await users.save();

        // create token and store cookie
        res.clearCookie(COOKIE_NAME, { httpOnly: true, domain:"localhost", signed: true, path: "/" });

        // Create and set token in cookie
        const token = createToken(users._id.toString(), users.email, "7d");
        const expires =  new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });

        return res.status(201).json({ message: "OK", id: users._id.toString() });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //user login
        const { email, password } = req.body;
        const users = await User.findOne({ email });
        if (!users) {
            return res.status(401).send({ message: "User not found" });
        }
        const isPasswordCorrect = await compare(password, users.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect password");
        }

        res.clearCookie(COOKIE_NAME, { httpOnly: true, domain:"localhost", signed: true, path: "/" });

        // Create and set token in cookie
        const token = createToken(users._id.toString(), users.email, "7d");
        const expires =  new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true });

        return res.status(200).json({ message: "OK", id: users._id.toString() });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};