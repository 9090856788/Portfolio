import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
    const port = Number(process.env.SMTP_PORT) || 587;
    const isSecure = port === 465;

    const authUser =
        process.env.SMTP_MAIL ||
        process.env.SMTP_USER ||
        process.env.EMAIL_USER ||
        process.env.EMAIL ||
        "";

    const authPass =
        process.env.SMTP_PASSWORD ||
        process.env.SMTP_PASS ||
        process.env.EMAIL_PASSWORD ||
        process.env.EMAIL_PASS ||
        "";

    const transportConfig = {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port,
        secure: isSecure,
        auth: {
            user: authUser,
            pass: authPass,
        },
    };

    if (process.env.SMTP_SERVICE) {
        transportConfig.service = process.env.SMTP_SERVICE;
    }

    const transporter = nodeMailer.createTransport(transportConfig);

    const fromAddress =
        process.env.SMTP_FROM ||
        authUser ||
        "Portfolio Studio <noreply@portfolio.local>";

    const mailOptions = {
        from: fromAddress,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || (options.message ? options.message.replace(/\n/g, "<br>") : ""),
    };

    return await transporter.sendMail(mailOptions);
};
