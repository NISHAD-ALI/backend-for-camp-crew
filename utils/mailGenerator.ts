import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  private generateUniqueCode(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  public async sendEnrollmentNotification(to: string, campName: string): Promise<void> {
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
      await this.transporter.sendMail(mailOptions);
      console.log('Enrollment notification sent successfully!');
    } catch (error) {
      console.error('Error sending enrollment notification:', error);
      throw new Error('Failed to send enrollment notification');
    }
  }
}

export default EmailService;
