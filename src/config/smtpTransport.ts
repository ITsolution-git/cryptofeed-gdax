const nodemailer = require('nodemailer');

// export default nodemailer.createTransport('SMTP', {
//     service: 'Gmail',
//     auth: {
//         user: 'roy.smith0820@gmail.com',
//         pass: '123calendar'
//     }
// });
export default nodemailer.createTransport('smtps://'+process.env.EMAIL_ADDRESS+':'+process.env.EMAIL_PASSWORD+'@smtp.gmail.com');