import { createBooking, getBooking, updateBooking } from "@/controllers/bookings-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken);
bookingRouter.get("/", getBooking);
bookingRouter.post("/", createBooking);
bookingRouter.put("/:id", updateBooking);

export {bookingRouter};