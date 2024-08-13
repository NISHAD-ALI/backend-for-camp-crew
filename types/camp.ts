import { ObjectId } from "mongoose";

export default interface camp{
    name:string,
    date:Date|string,
    location:string,
    organiser:ObjectId|string,
    image:string,
    description:string,
    participants?:[ObjectId],
}