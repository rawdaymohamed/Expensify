import express from "express";
import { registerUser } from "../controllers/authController.js";
import { registerSchema } from "../validations/authValidation.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);

export default router;
