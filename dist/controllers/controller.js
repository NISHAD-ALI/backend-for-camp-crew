"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCamps = exports.isUserEnrolled = exports.enrollToCamp = exports.getParticipants = exports.getCampsOne = exports.getCampsEnrolled = exports.getCamps = exports.newCamp = exports.editProfile = exports.getProfile = exports.login = exports.signup = void 0;
const campModel_1 = __importDefault(require("../models/campModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const hashPassword_1 = require("../utils/hashPassword");
const cloudinary_1 = require("../utils/cloudinary");
const mailGenerator_1 = __importDefault(require("../utils/mailGenerator"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const userData = { name, email, password: hashedPassword, phone };
        const exists = yield userModel_1.default.findOne({ email: email });
        if (!exists) {
            let newUser = new userModel_1.default(userData);
            yield newUser.save();
            res.status(200).json({ success: true });
        }
        else {
            res.status(409).json({ success: false, message: "Email already exists" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield userModel_1.default.findOne({ email: email });
        console.log(userData === null || userData === void 0 ? void 0 : userData.password);
        if (userData) {
            const isPasswordCorrect = yield (0, hashPassword_1.comparePassword)(password, userData.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password'
                });
            }
            res.status(200).json({ success: true, userData });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.id;
        console.log(userId);
        if (userId) {
            let data = yield userModel_1.default.findOne({ _id: userId });
            res.status(200).json({ success: true, data });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to user profile!' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getProfile = getProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newData = req.body;
        let profileImage = req.file;
        let uploadFile = yield (0, cloudinary_1.uploadImageToCloud)(profileImage);
        newData.image = uploadFile;
        console.log(newData);
        let response = yield userModel_1.default.findByIdAndUpdate({ _id: newData.id }, { $set: newData }, { new: true });
        console.log(response + "->api response");
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.editProfile = editProfile;
const newCamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('jj');
        const { name, date, location, userId, details } = req.body;
        console.log(name, date, location, userId);
        const exists = yield userModel_1.default.findOne({ _id: userId });
        let cImage = req.file;
        let uploadFile = yield (0, cloudinary_1.uploadImageToCloud)(cImage);
        let newCampData = {
            name: name,
            date: date,
            location: location,
            organiser: userId,
            image: uploadFile,
            description: details
        };
        let camp = new campModel_1.default(newCampData);
        yield camp.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.newCamp = newCamp;
const getCamps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield campModel_1.default.find({});
        if (data) {
            res.status(200).json({ success: true, data });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get camps' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getCamps = getCamps;
const getCampsEnrolled = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.id;
        const camps = yield campModel_1.default.find({ participants: userId });
        if (camps) {
            res.status(200).json({ success: true, camps });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get camps' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getCampsEnrolled = getCampsEnrolled;
const getCampsOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        const camps = yield campModel_1.default.findOne({ _id: id });
        console.log(camps);
        if (camps) {
            res.status(200).json({ success: true, camps });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get camp' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getCampsOne = getCampsOne;
const getParticipants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        const participants = yield campModel_1.default.findOne({ _id: id }).populate('participants');
        if (participants) {
            res.status(200).json({ success: true, participants: participants === null || participants === void 0 ? void 0 : participants.participants });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get camp participants' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getParticipants = getParticipants;
const enrollToCamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('here');
        const emailService = new mailGenerator_1.default();
        const campId = req.params.id;
        const userId = req.body.userId;
        const result = yield campModel_1.default.updateOne({ _id: campId }, { $addToSet: { participants: userId } });
        if (result.modifiedCount > 0) {
            const updatedCamp = yield campModel_1.default.findById(campId).populate('participants');
            const exists = yield userModel_1.default.findOne({ _id: userId });
            emailService.sendEnrollmentNotification(exists === null || exists === void 0 ? void 0 : exists.email, updatedCamp === null || updatedCamp === void 0 ? void 0 : updatedCamp.name)
                .then(() => {
                console.log('Email sent successfully!');
            })
                .catch((error) => {
                console.error('Error sending email:', error);
            });
            if (updatedCamp) {
                res.status(200).json({ success: true, participants: updatedCamp.participants });
            }
            else {
                res.status(404).json({ success: false, message: 'Camp not found' });
            }
        }
        else {
            res.status(400).json({ success: false, message: 'Failed to enroll user' });
        }
    }
    catch (error) {
        console.error('Error enrolling to camp:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.enrollToCamp = enrollToCamp;
const isUserEnrolled = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campId = req.params.id;
        const userId = req.query.userId;
        console.log(req.body + "pp");
        const camp = yield campModel_1.default.findOne({ _id: campId, participants: { $in: [userId] } });
        console.log(camp);
        if (camp) {
            console.log('yes');
            res.status(200).json({ success: true, message: 'User is enrolled in this camp' });
        }
        else {
            console.log('no');
            res.status(200).json({ success: false, message: 'User is not enrolled in this camp' });
        }
    }
    catch (error) {
        console.error('Error checking user enrollment:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.isUserEnrolled = isUserEnrolled;
const getMyCamps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        const camps = yield campModel_1.default.find({ organiser: id });
        console.log(camps);
        if (camps) {
            res.status(200).json({ success: true, camps });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get your camps' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getMyCamps = getMyCamps;
