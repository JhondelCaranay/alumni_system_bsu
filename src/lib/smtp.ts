import { env } from "@/env.mjs";
import * as nodemailer from "nodemailer";
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: env.NODEMAILER_GMAIL,
    pass: env.NODEMAILER_PASSWORD,
  },
});

const sendMail = ({
  subject,
  content,
  emailTo,
}: {
  subject: string;
  content: string;
  emailTo: string;
}) => {

    const details = {
        from: env.NODEMAILER_GMAIL,
        to: emailTo,
        subject,
        text: subject,
        html: content,
      };

      mailTransporter.sendMail(details, (err, info) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      })
  
};

export default sendMail