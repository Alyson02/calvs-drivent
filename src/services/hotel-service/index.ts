import { Hotel } from "@prisma/client";
import hotelRepository from "@/repositories/hotel-repository";
import ticketService from "../ticket-service";
import { notFoundError } from "@/errors";                                     ''

import { paymentRequired } from "./erros";

async function getAll(userId: number): Promise<Hotel[]> {
    await verifyConsistence(userId);

    const hoteis = await hotelRepository.getAll();

    return hoteis;
}

async function getById(id: number, userId: number): Promise<Hotel> {
    await verifyConsistence(userId);

    const hotel = await hotelRepository.getById(id);
    if (!hotel) throw notFoundError();

    return hotel
}

export default {
    getAll,
    getById
}

async function verifyConsistence(userId: number) {

    const ticket = await ticketService.getTickets(userId);
    if (!ticket) throw notFoundError();
    if (ticket.status != 'PAID') throw paymentRequired("tickt was not paid")
    if (ticket.TicketType.isRemote) throw paymentRequired("enrollment is remote")
    if (!ticket.TicketType.includesHotel) throw paymentRequired("enrollment not included hotel")

}