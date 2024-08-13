import express from "express";
const router = express.Router()
import { editProfile, enrollToCamp, getCamps, getCampsOne, getMyCamps, getParticipants, getProfile, isUserEnrolled, login, newCamp, signup } from "../controllers/controller";
import { uploadFile } from "../middlewares/multer";

router.post('/signup',(req,res)=>signup(req,res))
router.post('/login',(req,res)=>login(req,res))
router.get('/getProfile/:id',(req,res)=>getProfile(req,res))
router.patch('/editProfile', uploadFile.single('image'), (req, res) => editProfile(req,res));
router.post('/createCamp', uploadFile.single('image'), (req, res) => newCamp(req,res));
router.get('/getCamps',(req,res)=>getCamps(req,res))
router.get('/getCampsOne/:id',(req,res)=>getCampsOne(req,res))
router.get('/getParticipants/:id',(req,res)=>getParticipants(req,res))
router.get('/isEnrolled/:id',(req,res)=>isUserEnrolled(req,res))
router.post('/enrollToCamp/:id',(req,res)=>enrollToCamp(req,res))
router.get('/getMyCamps/:id',(req,res)=>getMyCamps(req,res))


export default router