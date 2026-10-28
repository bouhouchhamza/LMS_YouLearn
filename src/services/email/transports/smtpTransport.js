import nodemailer from "nodemailer";

// Create only when SMTP is selected, after environment configuration is loaded.
let transport;
export const sendSmtpEmail = async({to, subject, text, html})=>{
    transport ??= nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth:{
        user: process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    },
    requireTLS: true
});
        const mail = await transport.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html
        })

        return {
            success: true,
            transport: 'smtp',
            messageId: mail.messageId
        };
}
