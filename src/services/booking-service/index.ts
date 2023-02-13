import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository, { bookingData } from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Booking, Room, TicketStatus } from "@prisma/client";
import roomRepository from "../room-repository";

type resultBookingId = {
    roomId: number
}

async function getBooking(userId: number): Promise<bookingData> {
    const booking = await bookingRepository.getBooking(userId);

    if (booking === null) throw notFoundError();

    return booking;
}

async function createBooking(roomId: number, userId: number): Promise<resultBookingId> {
    await verifyRoomAvable(roomId);

    const ticket = await ticketRepository.listTickets(userId);

    if (ticket === null) throw forbiddenError("No ticket");
    if (ticket.TicketType.isRemote) throw forbiddenError("Ticket is remote")
    if (!ticket.TicketType.includesHotel) throw forbiddenError("Ticket not include hotel");
    if (ticket.status != TicketStatus.PAID) throw forbiddenError("Ticket not paid");

    const result = await bookingRepository.createBooking(roomId, userId);
    return {roomId: result.roomId};
}

async function changeRoom(roomId: number, bookingId: number, userId: number): Promise<resultBookingId> {
    const booking = await bookingRepository.getBooking(userId);

    if (booking === null) throw notFoundError();

    await verifyRoomAvable(roomId);

    const result = await bookingRepository.changeRoom(roomId, bookingId);
    return {roomId: result.roomId};
}

async function verifyRoomAvable(roomId: number): Promise<void> {
    const room = await roomRepository.getRoom(roomId);

    if (room === null) throw notFoundError();

    const countBooking = await bookingRepository.getCountBookingByRoom(roomId);

    if (countBooking === room.capacity) throw forbiddenError("Room is full");
}

export default {
    getBooking,
    createBooking,
    changeRoom
}