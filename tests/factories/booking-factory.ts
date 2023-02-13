import { prisma } from "@/config";
import { TicketStatus, User } from "@prisma/client";
import { createEnrollmentWithAddress } from "./enrollments-factory";
import { createPayment } from "./payments-factory";
import { createRoom } from "./room-factory";
import { createTicket, createTicketType } from "./tickets-factory";

export async function createBooking(user: User) {
    await processOfPayment(user, TicketStatus.PAID);
    const rooms = await createRoom();

    return prisma.booking.create({
        data: {
            roomId: rooms.id,
            userId: user.id
        }
    })
}

export async function processOfPayment(user: User, ticketStatus: TicketStatus, isRemote: boolean = undefined, includeHotel: boolean = undefined) {
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(includeHotel, isRemote);
    const ticket = await createTicket(enrollment.id, ticketType.id, ticketStatus);
    const payment = await createPayment(ticket.id, ticketType.price);
}

export async function createBookingManual(roomId: number, userId: number) {
    return prisma.booking.create({
        data: {
            roomId: roomId,
            userId: userId
        }
    })
}