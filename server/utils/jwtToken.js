import jwt from "jsonwebtoken";

export const generateJwtToken = (user, message, statusCode, res) => {
    let token;
    const secret = process.env.JWT_SECRET_KEY || "portfolio_dev_secret_key_2026";
    const expiresIn = process.env.JWT_EXPIRES || "7d";

    if (typeof user.generateJsonWebToken === "function") {
        token = user.generateJsonWebToken();
    } else {
        token = jwt.sign(
            {
                id: user._id || user.id || "664fca4cc0e4d9b9d392545b",
                email: user.email,
                fullName: user.fullName,
            },
            secret,
            { expiresIn }
        );
    }

    const cookieDays = Number(process.env.COOKIE_EXPIRES) || 7;

    res
        .status(statusCode)
        .cookie("token", token, {
            expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "lax",
        })
        .json({
            success: true,
            message,
            token,
            user,
        });
};
