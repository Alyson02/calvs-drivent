import ticketRepository, { TicketResponse } from "@/repositories/ticket-repository";
import { Ticket, TicketType } from "@prisma/client";
import enrollmentsService from "@/services/enrollments-service";

async function list(): Promise<TicketType[]> {
    return await ticketRepository.list();
}

async function getTickets(userId: number): Promise<TicketResponse> {
    return await ticketRepository.listTickets(userId);
}

async function create(body: CreateTicketParams, userId: number): Promise<Ticket> {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

    const ticket: Partial<Ticket> = {
        ticketTypeId: body.ticketTypeId,
        enrollmentId: enrollment.id,
        status: "RESERVED"
    }

    return await ticketRepository.create(ticket)
}

async function getTicketByIdAndUser(ticketId: number, userId: number): Promise<Ticket> {
    return await ticketRepository.getTicketByIdAndUser(ticketId, userId);
}

async function getTicketById(ticketId: number): Promise<Ticket> {
    return await ticketRepository.getTicketById(ticketId);
}

async function paidTicket(id: number): Promise<void> {
    await ticketRepository.paidTicket(id);
}


export default {
    list,
    getTickets,
    create,
    getTicketByIdAndUser,
    getTicketById,
    paidTicket
}

export type CreateTicketParams = Pick<Ticket, "ticketTypeId">

