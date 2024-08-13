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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }
    generateUniqueCode() {
        return crypto_1.default.randomBytes(8).toString('hex');
    }
    sendEnrollmentNotification(to, campName) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueCode = this.generateUniqueCode();
            const mailOptions = {
                from: `"Camp&Crew" <${process.env.EMAIL}>`,
                to,
                subject: 'Camp Enrollment Confirmation - Camp&Crew',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/dxriwp8sx/image/upload/v1723486794/ypdi1dztni8vrg4lh2nd.png" alt="Camp&Crew Logo" style="max-width: 200px; max-height: 50px; margin-bottom: 20px;" />
          </div>
          <p style="font-size: 18px; color: #333;"><strong>Hello,</strong></p>
          <p style="font-size: 16px; color: #555;">You have successfully enrolled in the camp: <strong>${campName}</strong>.</p>
          <p style="font-size: 16px; color: #555;">Here is your unique entry code: <strong>${uniqueCode}</strong></p>
          <p style="font-size: 16px; color: #555;">Please use the this unique entry code for easy check-in at the camp:</p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,<br>Team Camp&Crew</p>
          <hr style="border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; 2024 Camp&Crew. All rights reserved.</p>
        </div>
      `,
            };
            try {
                yield this.transporter.sendMail(mailOptions);
                console.log('Enrollment notification sent successfully!');
            }
            catch (error) {
                console.error('Error sending enrollment notification:', error);
                throw new Error('Failed to send enrollment notification');
            }
        });
    }
}
exports.default = EmailService;
