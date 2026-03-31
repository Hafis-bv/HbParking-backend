import { Router } from "express";
import { register } from "../controller/auth.controller";
import { login } from "../controller/auth.controller";
import { logout } from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export { router as authRouter };
