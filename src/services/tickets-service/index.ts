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

export default {
  list,
  getTickets,
  create
}

export type CreateTicketParams = Pick<Ticket, "ticketTypeId">
