import express from 'express';
import { Registercontroller,Logincontroller } from '../CONTROLLER/bankerlogic.js';
const router=express.Router();

router.post("/register",Registercontroller);
router.post("/login",Logincontroller);

export default router;