import { prisma } from "@/config";

async function getRoom(roomId: number) {
    return prisma.room.findFirst({ where: { id: roomId } })
}

export default{
    getRoom
}