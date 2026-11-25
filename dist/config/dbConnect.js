import mongoose from "mongoose";
const globalWithMongoose = globalThis;
const cached = globalWithMongoose.mongooseCache ??
    (globalWithMongoose.mongooseCache = {
        conn: null,
        promise: null,
    });
const dbConnect = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined");
    }
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
        })
            .then((mongooseInstance) => mongooseInstance)
            .catch((error) => {
            cached.promise = null;
            throw error;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
export default dbConnect;
