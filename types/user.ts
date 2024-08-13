import { ObjectId } from "mongoose";

export default interface user{
    name:string,
    password:string,
    email:string,
    phone:number,
    image:string,
    campsCreated:[ObjectId],
    campsEnrolled:[ObjectId],
}