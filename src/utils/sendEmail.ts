import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `HbParking <${process.env.SMTP_SERVER_USERNAME}>`,
      to: to,
      subject: subject,
      html: html,
    });
    console.log("Message sent successfully");
  } catch (err) {
    console.log(err);
  }
}
