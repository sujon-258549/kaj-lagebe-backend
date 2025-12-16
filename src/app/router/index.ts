import { Router } from "express";
import { UserRouter } from "../modules/users/user.router.js";
import { CategoryRouter } from "../modules/category/category.router.js";
import { authRouter } from "../modules/auth/login.router.js";

const router = Router()

const allRouter = [
    {
        path:'/employ',
        router : UserRouter
    },
    {
        path:'/category',
        router : CategoryRouter
    },
    {
        path:'/auth',
        router : authRouter
    }
]

allRouter.forEach((route) => router.use(route.path, route.router))


export default router