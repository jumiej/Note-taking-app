import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validateRegister, validateLogin } from "../middleware/validate";

const router = Router();

// Public routes — no token needed
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
