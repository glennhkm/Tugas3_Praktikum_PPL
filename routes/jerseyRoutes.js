import express from "express";
import jerseyController from "../controllers/jerseyController.js";

const jerseyRoutes = express.Router();

jerseyRoutes.get("/", jerseyController.getJerseyList);
jerseyRoutes.get("/:id", jerseyController.getJerseyById);
// jerseyRoutes.get("/grade", jerseyController.getJerseyByGradeAndKitType);

export default jerseyRoutes;