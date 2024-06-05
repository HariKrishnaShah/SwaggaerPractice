import mongoose, { Schema, Document } from 'mongoose';
import { Model } from 'mongoose';

// Define the user schema
export interface User {
    username: string;
    email: string;
    password: string;
}
export type DocUser = User & {createdAt?: Date;};
export interface UserModelSchema extends Model<DocUser> {}


const userSchema: Schema<DocUser> = new Schema<DocUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const UserModel: UserModelSchema = mongoose.model<DocUser, UserModelSchema>('User', userSchema);

export default UserModel;
