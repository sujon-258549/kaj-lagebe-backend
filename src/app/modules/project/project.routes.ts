import express from "express";
import { ProjectControllers } from "./project.controller.ts";
import auth from "../../utils/auth.ts";

const router = express.Router();

router.post("/", auth(), ProjectControllers.createProject);
router.get("/", ProjectControllers.getAllProjects);
router.get("/:id", ProjectControllers.getSingleProject);
router.get("/slug/:slug", ProjectControllers.getProjectBySlug);
router.patch("/:id", auth(), ProjectControllers.updateProject);
router.delete("/:id", auth(), ProjectControllers.deleteProject);
router.patch("/status/:id", auth(), ProjectControllers.updateStatus);

export const ProjectRoutes = router;
