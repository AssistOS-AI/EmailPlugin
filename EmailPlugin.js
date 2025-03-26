const sgMail = require('@sendgrid/mail');
async function EmailPlugin(){
    let self = {};
    if(!process.env.SENDGRID_API_KEY){
        console.error("SentGRID API key missing. using default key");
        //must set sender email support@outfinitygift.com in env, for testing
        process.env.SENDGRID_API_KEY = "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";
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    self.sendEmail = async function(to, from, subject, text, html){
        const msg = {
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        };
        await sgMail.send(msg);
    }
    self.sendFromTemplate = async function(to, from, templateId, dynamicTemplateData){
        const msg = {
            to: to,
            from: from,
            templateId: templateId,
            dynamicTemplateData: dynamicTemplateData,
        };
        await sgMail.send(msg);
    }
    return self;
}

let singletonInstance = undefined;

module.exports = {
    getInstance: async function () {
        if(!singletonInstance){
            singletonInstance = await EmailPlugin();
        }
        return singletonInstance;
    },
    getAllow: function(){
        return async function(globalUserId, email, command, ...args){
            return true;
        }
    }
}