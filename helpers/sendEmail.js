import nodemailer from "nodemailer";

const { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } = process.env;

const nodemailerConfig = {
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (payload) => {
  const email = { ...payload, from: EMAIL_USER };
  return transport.sendMail(email);
};

export default sendEmail;