// emailService.js

import { createTransport } from 'nodemailer';

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'yashjadhav.synsoft@gmail.com',  
        pass: 'cbnj dwpi ezsl cwrk'  
    }
});

const sendPasswordResetEmail = async (email, resetLink) => {
    try {
        const mailOptions = {
            from: '"FRYDAY 🚀"<yashjadhav.synsoft@gmail.com>',   
            to: email,
            subject: 'Password Reset Link',
            html: `<b>Click the following link to reset your password: <a href="${resetLink}"></a></b>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.response);

        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

export default {
    sendPasswordResetEmail,
   
};
