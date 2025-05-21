const sgMail = require('@sendgrid/mail');

async function EmailPlugin() {
    let self = {};
    if (!process.env.SENDGRID_API_KEY) {
        console.debug("SentGRID API key missing. using default key");
        //must set sender email support@outfinitygift.com in env, for testing
        process.env.SENDGRID_API_KEY = "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";
    }
    console.log("---------------------------------------------------")
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    self.sendEmail = async function (to, from, subject, text, html) {
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
    self.sendFromTemplate = async function (to, from, templateId, dynamicTemplateData) {
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
            return false;
        }
    }
}
