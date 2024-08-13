import campModel from "../models/campModel";
import userModel from "../models/userModel";
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { uploadImageToCloud } from "../utils/cloudinary";
import user from "../types/user";
import camp from "types/camp";
import { ObjectId } from "mongoose";
import EmailService from "../utils/mailGenerator";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;
        const hashedPassword = await hashPassword(password);
        const userData = { name, email, password: hashedPassword, phone };

        const exists = await userModel.findOne({ email: email });
        if (!exists) {
            let newUser = new userModel(userData);
            await newUser.save();
            res.status(200).json({ success: true });
        } else {
            res.status(409).json({ success: false, message: "Email already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userData = await userModel.findOne({ email: email });
        console.log(userData?.password)
        if (userData) {
            const isPasswordCorrect = await comparePassword(password, userData.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password'
                });
            }
            res.status(200).json({ success: true, userData });
        } else {
            res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getProfile = async (req: Request, res: Response) => {
    try {
        let userId = req.params.id
        console.log(userId)
        if (userId) {
            let data = await userModel.findOne({ _id: userId })
            res.status(200).json({ success: true, data })
        } else {
            res.status(402).json({ success: false, message: 'Failed to user profile!' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}

export const editProfile = async (req: Request, res: Response) => {
    try {
        let newData = req.body
        let profileImage = req.file
        let uploadFile = await uploadImageToCloud(profileImage)
        newData.image = uploadFile
        console.log(newData)
        let response = await userModel.findByIdAndUpdate(
            { _id: newData.id },
            { $set: newData },
            { new: true }
        );
        console.log(response + "->api response")
        res.status(200).json({ success: true })
    } catch (error) {
        console.error(error)
        throw error
    }
}
export const newCamp = async (req: Request, res: Response) => {
    try {
        console.log('jj')
        const { name, date, location, userId, details } = req.body;
        console.log(name, date, location, userId)
        const exists = await userModel.findOne({ _id: userId });
        let cImage = req.file
        let uploadFile = await uploadImageToCloud(cImage)
        let newCampData: camp = {
            name: name as string,
            date: date as string,
            location: location as string,
            organiser: userId as string,
            image: uploadFile as string,
            description: details as string
        }
        let camp = new campModel(newCampData);
        await camp.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const getCamps = async (req: Request, res: Response) => {
    try {
        let data = await campModel.find({})
        if (data) {
            res.status(200).json({ success: true, data })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get camps' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}
export const getCampsEnrolled = async (req: Request, res: Response) => {
    try {
        let userId = req.params.id
        const camps = await campModel.find({ participants: userId });
        if (camps) {
            res.status(200).json({ success: true, camps })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get camps' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}
export const getCampsOne = async (req: Request, res: Response) => {
    try {
        let id = req.params.id
        const camps = await campModel.findOne({ _id: id });
        console.log(camps)
        if (camps) {
            res.status(200).json({ success: true, camps })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get camp' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}
export const getParticipants = async (req: Request, res: Response) => {
    try {
        let id = req.params.id
        const participants = await campModel.findOne({ _id: id }).populate('participants')
        if (participants) {
            res.status(200).json({ success: true, participants: participants?.participants })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get camp participants' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}
export const enrollToCamp = async (req: Request, res: Response) => {
    try {
        console.log('here');
        const emailService = new EmailService();
        const campId = req.params.id;
        const userId = req.body.userId;
        const result = await campModel.updateOne(
            { _id: campId },
            { $addToSet: { participants: userId } }
        );

        if (result.modifiedCount > 0) {
            const updatedCamp = await campModel.findById(campId).populate('participants');
            const exists = await userModel.findOne({ _id: userId });
            emailService.sendEnrollmentNotification(exists?.email as string,updatedCamp?.name as string )
                .then(() => {
                    console.log('Email sent successfully!');
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                });
            if (updatedCamp) {
                res.status(200).json({ success: true, participants: updatedCamp.participants });
            } else {
                res.status(404).json({ success: false, message: 'Camp not found' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Failed to enroll user' });
        }
    } catch (error) {
        console.error('Error enrolling to camp:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};

export const isUserEnrolled = async (req: Request, res: Response) => {
    try {
        const campId = req.params.id;
        const userId = req.query.userId
        console.log(req.body + "pp")
        const camp = await campModel.findOne({ _id: campId, participants: { $in: [userId] } });
        console.log(camp)
        if (camp) {
            console.log('yes')
            res.status(200).json({ success: true, message: 'User is enrolled in this camp' });
        } else {
            console.log('no')
            res.status(200).json({ success: false, message: 'User is not enrolled in this camp' });
        }
    } catch (error) {
        console.error('Error checking user enrollment:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};
export const getMyCamps = async (req: Request, res: Response) => {
    try {
        let id = req.params.id
        const camps = await campModel.find({ organiser: id });
        console.log(camps)
        if (camps) {
            res.status(200).json({ success: true, camps })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get your camps' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}