const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '2020clink@lonejackc6.net',
        subject: 'Thanks for joining us!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '2020clink@lonejackc6.net',
        subject: 'Glad to see you go!',
        text: `Sorry you needed to go, ${name}. Goodbye.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}