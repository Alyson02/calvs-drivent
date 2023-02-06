import { getAllHotel, getHotelById } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter.get("/", authenticateToken, getAllHotel);
hotelsRouter.get("/:id", authenticateToken, getHotelById)

export { hotelsRouter };
