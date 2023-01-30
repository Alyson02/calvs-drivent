
import { AuthenticatedRequest } from "@/middlewares";
import ticketService, { CreateTicketParams } from "@/services/ticket-service";
import { Ticket } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

async function list(req: Request, res: Response) {
    const types = await ticketService.list();
    res.send(types);
}

async function listTickets(req: AuthenticatedRequest, res: Response) {
    const tickets = await ticketService.getTickets(req.userId)
    if (tickets === null) return res.sendStatus(httpStatus.NOT_FOUND)
    res.send(tickets);
}

async function create(req: AuthenticatedRequest, res: Response) {
    const ticketCreated = await ticketService.create(req.body as CreateTicketParams, req.userId);
    res.status(httpStatus.CREATED).send(ticketCreated)
}

export default {
    list,
    listTickets,
    create
}