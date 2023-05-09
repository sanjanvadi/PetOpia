import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const emailSender = (toAddress, forWhat, forWhom, content) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: toAddress,
    subject: `${forWhat} reminder for ${forWhom} from PetOpia!`,
    text: content,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  transporter.sendMail(mailOptions);
};

export default emailSender;
