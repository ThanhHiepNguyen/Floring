import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly emailUser: string;
  private readonly adminEmail: string;

  constructor() {
    const emailHost = process.env.EMAIL_HOST;
    const emailPortRaw = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailPort = Number(emailPortRaw);

    if (!emailHost || !emailPortRaw || !Number.isFinite(emailPort) || !emailUser || !emailPassword || !adminEmail) {
      throw new Error('Missing EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD or ADMIN_EMAIL in .env');
    }
    this.emailUser = emailUser;
    this.adminEmail = adminEmail;

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }

  /**
   * Gửi email thông báo cho admin khi có yêu cầu mới
   */
  async notifyAdminNewQuote(
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    productName?: string,
    area?: number,
  ) {
    const mailOptions = {
      from: `"Floring Shop System" <${this.emailUser}>`,
      to: this.adminEmail,
      subject: '🔔 Yêu cầu khảo sát & thi công mới - Floring Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #e74c3c; border-bottom: 3px solid #e74c3c; padding-bottom: 10px;">
            🔔 Yêu cầu khảo sát & thi công mới!
          </h2>
          
          <p style="font-size: 16px;">Có khách hàng mới gửi yêu cầu khảo sát & thi công:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; width: 40%;">
                Tên khách hàng:
              </td>
              <td style="padding: 12px; border: 1px solid #ddd;">
                ${customerName}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">
                Số điện thoại:
              </td>
              <td style="padding: 12px; border: 1px solid #ddd;">
                ${customerPhone}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">
                Email:
              </td>
              <td style="padding: 12px; border: 1px solid #ddd;">
                <a href="mailto:${customerEmail}" style="color: #3498db;">${customerEmail}</a>
              </td>
            </tr>
            ${area ? `
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">
                Diện tích:
              </td>
              <td style="padding: 12px; border: 1px solid #ddd;">
                ${area} m²
              </td>
            </tr>
            ` : ''}
            ${productName ? `
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">
                Sản phẩm:
              </td>
              <td style="padding: 12px; border: 1px solid #ddd;">
                ${productName}
              </td>
            </tr>
            ` : ''}
          </table>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              ⚡ <strong>Vui lòng liên hệ lại khách hàng sớm!</strong>
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(' Admin notification sent');
    } catch (error) {
      console.error(' Error sending admin notification:', error);
    }
  }

  async sendContactReplyEmail(input: {
    to: string;
    customerName: string;
    subject: string;
    message: string;
  }) {
    const mailOptions = {
      from: `"Floring Support" <${this.emailUser}>`,
      to: input.to,
      subject: input.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1f2937;">
          <h2 style="margin: 0 0 12px; color: #111827;">Floring phản hồi yêu cầu của bạn</h2>
          <p style="margin: 0 0 16px;">Xin chào <strong>${input.customerName}</strong>,</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; white-space: pre-wrap; line-height: 1.65;">
            ${input.message}
          </div>
          <p style="margin: 18px 0 0;">Trân trọng,<br /><strong>Floring Team</strong></p>
        </div>
      `,
      text: `Xin chào ${input.customerName},\n\n${input.message}\n\nTrân trọng,\nFloring Team`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendContactAutoReceivedEmail(input: {
    to: string;
    customerName: string;
  }) {
    const mailOptions = {
      from: `"Floring Support" <${this.emailUser}>`,
      to: input.to,
      subject: 'Floring đã nhận yêu cầu của bạn',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; color: #1f2937;">
          <h2 style="margin: 0 0 12px; color: #111827;">Floring đã nhận yêu cầu của bạn</h2>
          <p style="margin: 0 0 16px;">Xin chào <strong>${input.customerName}</strong>,</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; line-height: 1.65;">
            Floring đã nhận được yêu cầu của bạn thành công.<br/>
            Đội ngũ đang xử lý và sẽ liên hệ lại trong thời gian sớm nhất.<br/><br/>
            Bạn vui lòng chờ phản hồi từ Floring. Cảm ơn bạn!
          </div>
          <p style="margin: 18px 0 0;">Trân trọng,<br /><strong>Floring Team</strong></p>
        </div>
      `,
      text: `Xin chào ${input.customerName},\n\nFloring đã nhận được yêu cầu của bạn thành công.\nĐội ngũ đang xử lý và sẽ liên hệ lại trong thời gian sớm nhất.\n\nBạn vui lòng chờ phản hồi từ Floring. Cảm ơn bạn!\n\nTrân trọng,\nFloring Team`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
