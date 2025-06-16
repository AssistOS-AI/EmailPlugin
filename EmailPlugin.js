const sgMail = require('@sendgrid/mail');

async function EmailPlugin() {
    let self = {};
    if (!process.env.SENDGRID_API_KEY) {
        console.error("SENDGRID_API_KEY is not set");
    }
    console.log("DEBUG----------: SENDGRID_API_KEY", process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    self.sendEmail = async function (userId, to, from, subject, text, html) {
        const msg = {
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        };
        console.log(JSON.stringify(msg));
        console.log("---------------------------------------------------")
        try {
            await sgMail.send(msg);
        } catch (e) {
            console.log(e);
        }

    }
    self.sendFromTemplate = async function (userId, to, from, templateId, dynamicTemplateData) {
        const msg = {
            to: to,
            from: from,
            templateId: templateId,
            dynamicTemplateData: dynamicTemplateData,
        };
        try {
            await sgMail.send(msg);
        } catch (e) {
            console.log(e);
        }
    }
    return self;
}

let singletonInstance = undefined;

module.exports = {
    getInstance: async function () {
        if (!singletonInstance) {
            singletonInstance = await EmailPlugin();
        }
        return singletonInstance;
    },
    getAllow: function () {
        return async function (globalUserId, email, command, ...args) {
            switch (command) {
                case "sendFromTemplate":
                case "sendEmail":
                    return false;
                default:
                    return false;
            }
        }
    }
}
