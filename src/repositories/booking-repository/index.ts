import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

async function getBooking(userId: number): Promise<bookingData> {
    return await prisma.booking.findFirst({ where: { userId: userId }, select: { id: true, Room: true } });
}

export type bookingData = {
    id?: number;
    Room?: Room;
}

async function createBooking(roomId: number, userId: number): Promise<Booking> {
    return await prisma.booking.create({
        data: {
            roomId: roomId,
            userId: userId
        }
    })
}

async function changeRoom(roomId: number, bookingId: number): Promise<Booking> {
    return await prisma.booking.update({ where: { id: bookingId }, data: { roomId: roomId } })
}

async function getCountBookingByRoom(roomId: number) {
    const agr = await prisma.booking.aggregate({ _count: { id: true }, where: { roomId: roomId } });
    return agr._count.id;
}

export default {
    getBooking,
    createBooking,
    changeRoom,
    getCountBookingByRoom
}