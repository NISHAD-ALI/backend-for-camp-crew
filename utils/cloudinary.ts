import { v2 } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
console.log("fro-",process.env.CLOUD_KEY)

 export const uploadImageToCloud =  async (image: any)=> {
    try {
        const result = await v2.uploader.upload(image?.path, {
            resource_type: "image"
        });
        return result.secure_url; 
    } catch (error: any) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error; 
    }
}