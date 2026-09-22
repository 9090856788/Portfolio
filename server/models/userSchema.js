import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name Required!"],
        default: "Administrator",
    },
    email: {
        type: String,
        required: [true, "Email Required!"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        default: "",
    },
    aboutMe: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "",
        },
    },
    resume: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "",
        },
    },
    portfolioURL: {
        type: String,
        default: "",
    },
    githubURL: String,
    instagramURL: String,
    facebookURL: String,
    twitterURL: String,
    linkedInURL: String,
    role: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    services: [
        {
            title: {
                type: String,
                default: "",
            },
            content: {
                type: String,
                default: "",
            },
            imageSrc: {
                type: String,
                default: "",
            },
        },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// for hashing the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// for compare with hashing password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// generating json web Token
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, fullName: this.fullName },
        process.env.JWT_SECRET_KEY || "portfolio_dev_secret_key_2026",
        {
            expiresIn: process.env.JWT_EXPIRES || "7d",
        }
    );
};

//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and Adding Reset Password Token To UserSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //Setting Reset Password Token Expiry Time
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
