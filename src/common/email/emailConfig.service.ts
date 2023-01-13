const nodemailer = require('nodemailer');
require("dotenv").config();

export class EmailConfigService {
    // email service nodemailer


    async createTransporter(options: Record<string, any>) {
        return nodemailer.createTransport({
            port: options.port,
            host: options.host,
            name: options.host,
            secure: true,

            auth: {
                user: options.from,
                pass: options.password
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    // *nodeMailer Default Configuration
    async transporter() {
        return nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",

            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASS
            }
        })
    }

    // *mail Email
    mailOptions = {
        from: 'deepeshnarutouzumaki@gmail.com',
        to: 'deepeshnarutouzumaki@gmail.com',
        subject: 'Sending Email using Node.js',
        html: '<div><img src="https://3822-2401-4900-1f3f-6bfa-99c-3a89-e18f-1403.ngrok.io/trackMail/jfvmdbfdvsdvjbjbvjb" style="width:0px;max-height:0px;display:none;" alt="it didnot work"/><h1>Welcome</h1><p>That was easy!</p></div>'
    };

    // *ForgetPassword  Mail Template

    async forgotPasswordMail(receiver, token) {
        return {
            from: process.env.GMAIL_ID,
            to: receiver,
            subject: 'Forget Password Link',
            html: `<div><h1>Click on the given link to move the Reset Password Page</h1> <a href='http://localhost:3000/resetPassword/${token}' target='_blank' >Click Here</a></div>`
        }
    }

    // *Verify register User Mail Template

    async verifyRegisterMail(receiver, token) {
        return {
            from: process.env.GMAIL_ID,
            to: receiver,
            subject: 'Verify New UserLink',
            html: `<div> <h1>The link is only valid for 5 min</h1><br/><h4>Click on the given link to verify your self</h4> <a href='http://localhost:3001/api/auth/verifyUser/${token}' target='_blank' >Click Here</a></div>`
        }
    }

}