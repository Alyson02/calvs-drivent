import { Hotel } from "@prisma/client";
import { prisma } from "@/config";

async function getAll(): Promise<Hotel[]> {
    return await prisma.hotel.findMany();
}

async function getById(id: number): Promise<Hotel> {
    return await prisma.hotel.findFirst({ where: { id: id }, include: { Rooms: true } });
}

export default {
    getAll,
    getById
}
