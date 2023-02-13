import { prisma } from "@/config"
import { Ticket, TicketType } from "@prisma/client";

async function list(): Promise<TicketType[]> {
    return await prisma.ticketType.findMany();
}

async function listTickets(userId: number): Promise<TicketResponse> {
    return await prisma.ticket.findFirst({
        include: { TicketType: true },
        where: { Enrollment: { userId: userId } },
        orderBy: { id: "desc" }
    });
}

export type TicketResponse = Ticket & {
    TicketType?: TicketType
}

async function getTicketByIdAndUser(ticketId: number, userId: number): Promise<Ticket> {
    return await prisma.ticket.findFirst({ where: { id: ticketId, Enrollment: { userId: userId } } });
}

async function getTicketById(ticketId: number): Promise<Ticket> {
    return await prisma.ticket.findFirst({ where: { id: ticketId } });
}

async function create(ticket: Partial<Ticket>): Promise<Ticket> {
    return await prisma.ticket.create({ data: ticket as Ticket, include: { TicketType: true } })
}

async function paidTicket(id: number): Promise<void> {
    await prisma.ticket.update({ where: { id: id }, data: { status: "PAID" } })
}

export default {
    list,
    listTickets,
    create,
    getTicketByIdAndUser,
    getTicketById,
    paidTicket
}
