import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { createHotel } from "./hotels-factory";

export async function createRoom() {
    const hotel = await createHotel();
    
    return prisma.room.create({
        data:
        {
            name: faker.name.firstName(),
            capacity: faker.datatype.number({
                min: 1,
                max: 3
            }),
            hotelId: hotel.id
        }
    })
}