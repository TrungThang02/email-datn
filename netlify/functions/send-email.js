import nodemailer from 'nodemailer';

export async function handler(event) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Phương thức không được hỗ trợ' }),
        };
    }

    try {
        const { recipient, subject, html } = JSON.parse(event.body);
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });

        const mailOptions = {
            from: `"E-Library TDMU" <${user}>`,
            to: recipient,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Email đã gửi thành công', info }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Lỗi khi gửi email' }),
        };
    }
}