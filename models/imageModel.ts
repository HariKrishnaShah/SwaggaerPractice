import mongoose, { Schema, Document } from 'mongoose';
import { Model } from 'mongoose';

export type ImageDescrtipion = 
{
    description : String
}

export type ImageType = ImageDescrtipion & {
    name: String
    createdAt : Date
}

const ImageSchema : Schema<ImageType> = new Schema<ImageType>({
    createdAt:{
        type:Date,
        default:Date.now
    },
    name:{
        type: String
    },
    description:
    {
        type: String
    }
})

const ImageModel = mongoose.model<ImageType>('Image', ImageSchema);
export default ImageModel;
