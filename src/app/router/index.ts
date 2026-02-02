import { Router } from "express";
import { UserRouter } from "../modules/users/user.router.ts";
import { CategoryRouter } from "../modules/category/category.router.ts";
import { authRouter } from "../modules/auth/login.router.ts";
import { SubCategoryRoutes } from "../modules/subCategory/subCategory.routes.ts";
import { BlogRoutes } from "../modules/blog/blog.routes.ts";
import { MediaRoutes } from "../modules/media/media.routes.js";
import { FolderRoutes } from "../modules/folder/folder.routes.ts";
import { SubscriptionRoutes } from "../modules/subscription/subscription.routes.ts";
import { ApplicationRoutes } from "../modules/application/application.routes.ts";
import { CommentRoutes } from "../modules/comment/comment.routes.ts";
import { NotificationRoutes } from "../modules/notification/notification.routes.ts";
import { JobRoutes } from "../modules/job/job.routes.ts";

const router = Router();

const allRouter = [
  {
    path: "/employ",
    router: UserRouter,
  },
  {
    path: "/category",
    router: CategoryRouter,
  },
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/sub-category",
    router: SubCategoryRoutes,
  },
  {
    path: "/subscription",
    router: SubscriptionRoutes,
  },
  {
    path: "/blog",
    router: BlogRoutes,
  },
  {
    path: "/media",
    router: MediaRoutes,
  },
  {
    path: "/folder",
    router: FolderRoutes,
  },
  {
    path: "/application",
    router: ApplicationRoutes,
  },
  {
    path: "/comment",
    router: CommentRoutes,
  },
  {
    path: "/notification",
    router: NotificationRoutes,
  },
  {
    path: "/job",
    router: JobRoutes,
  },
];

allRouter.forEach((route) => router.use(route.path, route.router));

export default router;
