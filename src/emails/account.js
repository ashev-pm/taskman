const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "jailbot134@gmail.com",
        subject: "Welcome to the App!",
        text: `Welcome to the App, ${name}. Let me know you get along with the app.`
    })
};

const sendFarewellEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "jailbot134@gmail.com",
        subject: "Sad to see you go!",
        text: `But we will handle it, ${name}. Have a nice life.`
    })
};

// const sendEmail = (to, from, subject, text) => {
//     const emailToSend = {
//         to,
//         from,
//         subject,
//         text
//     };

//     sgMail.send(emailToSend); 
// };

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}