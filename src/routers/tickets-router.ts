import ticketsController from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas/ticket-schemas";
import { Router } from "express";



const ticketRouter = Router();

ticketRouter.get("/types", authenticateToken, ticketsController.list);
ticketRouter.get("", authenticateToken, ticketsController.listTickets);
ticketRouter.post("", authenticateToken, validateBody(createTicketSchema), ticketsController.create)

export { ticketRouter };
