import { Request } from 'express';
import nodemailer from 'nodemailer';

export const getToken = (req: Request) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token: string = authorizationHeader.split(' ')[1];
        return token;
    }
    return null;
};

// send mail
export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    tls: {
        ciphers: 'SSLv3',
    },
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendMail = async (
    to: string,
    subject: string,
    message: string
) => {
    const options = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text: message,
    };

    try {
        const info = await transporter.sendMail(options);
        // eslint-disable-next-line no-console
        console.log('Email sent:', info);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error sending email to', to, error);
    }
};
