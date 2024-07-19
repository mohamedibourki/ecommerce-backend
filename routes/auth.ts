import express from "express"
import { login, logout, refreshToken, register } from "../middlewares/auth"
import { loginLimiter } from "../middlewares/rateLimit"
import { verifyEmail } from "../middlewares/verifyemail"

const router = express.Router()

router.post("/register", register)
router.get('/verifyemail/:token', verifyEmail);
router.post("/login", loginLimiter, login)
router.post("/refreshToken", refreshToken)
router.post("/logout", logout)

export default router