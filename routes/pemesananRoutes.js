import express from "express";
import pemesananController from "../controllers/pemesananController.js";

const pemesananRoutes = express.Router();

pemesananRoutes.get("/", pemesananController.getPemesananList);
pemesananRoutes.get("/:id", pemesananController.getPemesananById);
pemesananRoutes.post("/", pemesananController.addPemesanan);
pemesananRoutes.put("/:id", pemesananController.updatePemesanan);

export default pemesananRoutes;




