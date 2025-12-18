import { Router } from "express";
import { UserRouter } from "../modules/users/user.router.ts";
import { CategoryRouter } from "../modules/category/category.router.ts";
import { authRouter } from "../modules/auth/login.router.ts";
import { SubCategoryRoutes } from "../modules/subCategory/subCategory.routes.ts";


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
    },{
        path:'/sub-category',
        router : SubCategoryRoutes
    }
]

allRouter.forEach((route) => router.use(route.path, route.router))


export default router