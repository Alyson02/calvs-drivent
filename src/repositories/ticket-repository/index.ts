import { prisma } from "@/config"
import { Ticket, TicketType } from "@prisma/client";

async function list(): Promise<TicketType[]> {
    return await prisma.ticketType.findMany();
}

async function listTickets(userId: number): Promise<Ticket[]> {
    return await prisma.ticket.findMany({ include: { TicketType: true }, where: { Enrollment: { userId: userId } } });
}

async function create(ticket: Partial<Ticket>): Promise<Ticket> {
    return await prisma.ticket.create({ data: ticket as Ticket, include: { TicketType: true } })
}

export default {
    list,
    listTickets,
    create
}
