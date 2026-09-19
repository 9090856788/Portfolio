import mongoose from "mongoose";
import { User } from "../models/userSchema.js";

const DEFAULT_MONGO_URI = "mongodb+srv://appseralabs_db_user:appseralabs@portfolio.ofiupum.mongodb.net/portfolio?retryWrites=true&w=majority";

async function seedAdminUser() {
    try {
        const adminEmail = "admin@gmail.com";
        let existing = await User.findOne({ email: adminEmail });
        if (!existing) {
            existing = await User.create({
                fullName: "Admin",
                email: adminEmail,
                phone: "",
                password: "admin123",
                aboutMe: "",
                role: "",
                location: "",
                avatar: { public_id: "", url: "" },
                resume: { public_id: "", url: "" },
            });
            console.log(`[MongoDB] Default admin established: ${adminEmail} (password: admin123)`);
        }
        // Also ensure any old default record with test@example.com is cleaned so it doesn't leak into portfolio
        const oldUser = await User.findOne({ email: "test@example.com" });
        if (oldUser) {
            oldUser.fullName = "Admin";
            oldUser.email = adminEmail;
            oldUser.phone = "";
            oldUser.aboutMe = "";
            oldUser.role = "";
            oldUser.location = "";
            await oldUser.save();
        }
    } catch (e) {
        // Silently handle if collection already initialized
    }
}

const dbConnection = () => {
    mongoose.set('bufferCommands', false);
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI || DEFAULT_MONGO_URI;
    
    mongoose
        .connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        })
        .then(() => {
            console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name || 'portfolio'}`);
            seedAdminUser();
        })
        .catch((err) => {
            console.warn(
                `[MongoDB] Connection warning (fallback data store active): `,
                err.message
            );
        });
};

export default dbConnection;
