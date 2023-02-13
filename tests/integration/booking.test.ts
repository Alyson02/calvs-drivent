import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus, User } from "@prisma/client";
import supertest from "supertest";
import { createHotel, createUser } from "../factories";
import { createBooking, createBookingManual, processOfPayment } from "../factories/booking-factory";
import { createRoom } from "../factories/room-factory";
import { cleanDb, generateValidToken } from "../helpers";

let user: User = null;
let token: string = "";

beforeAll(async () => {
    await init();
})

afterAll(async () => {
    await cleanDb();
})

beforeEach(async () => {
    await cleanDb();
    user = await createUser();
    token = `Bearer ${await generateValidToken(user)}`;
})

const api = supertest(app);

describe("GET /booking", () => {

    it("when not authenticate", async () => {
        const result = await api.get("/booking");
        expect(result.statusCode).toBe(401);
    });

    it("when token is invalid", async () => {
        const result = await api.get(`/booking`).set("Authorization", "Bearer TOKENERRADO123");
        expect(result.statusCode).toBe(401);
    });

    it("when user dont have booking", async () => {
        const result = await api.get(`/booking`).set("Authorization", token)
        expect(result.statusCode).toBe(404)
    })

    it("should status 200 and booking data", async () => {
        await createBooking(user);

        const result = await api.get("/booking").set("Authorization", token);

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
            id: expect.any(Number),
            Room: expect.objectContaining({
                name: expect.any(String),
                capacity: expect.any(Number)
            })
        })
    })

})

describe("POST /booking", () => {

    it("when not authenticate", async () => {
        const result = await api.post("/booking");
        expect(result.statusCode).toBe(401);
    });

    it("when token is invalid", async () => {
        const result = await api.post(`/booking`).set("Authorization", "Bearer TOKENERRADO123");
        expect(result.statusCode).toBe(401);
    });

    it('should status 403 when user dont have ticket', async () => {
        const hotel = await createHotel();
        const room = await createRoom();

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 404 when room dont exists', async () => {
        const result = await api.post("/booking").set("Authorization", token).send({ roomId: 20000 });
        expect(result.statusCode).toBe(404);
    });

    it('should status 403 when ticket is remote', async () => {
        await processOfPayment(user, TicketStatus.RESERVED, true, false);
        const hotel = await createHotel();
        const room = await createRoom();

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 403 when ticket dont include hotel', async () => {
        await processOfPayment(user, TicketStatus.RESERVED, false, false);
        const hotel = await createHotel();
        const room = await createRoom();

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 403 when ticket dont paid', async () => {
        await processOfPayment(user, TicketStatus.RESERVED, false, true);
        const hotel = await createHotel();
        const room = await createRoom();

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 403 when room is full', async () => {
        await processOfPayment(user, TicketStatus.PAID, false, true);
        const room = await createRoom();

        for (let i = 0; i < room.capacity; i++) {
            await prisma.booking.create({
                data: {
                    roomId: room.id,
                    userId: user.id
                }
            })
        }

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 200 and roomId', async () => {
        await processOfPayment(user, TicketStatus.PAID, false, true);
        const room = await createRoom();

        const result = await api.post("/booking").set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(200);
        expect(result.body).toMatchObject({ roomId: expect.any(Number) })
    });
})

describe("PUT /booking", () => {

    it("when not authenticate", async () => {
        const result = await api.put("/booking/1");
        expect(result.statusCode).toBe(401);
    });

    it("when token is invalid", async () => {
        const result = await api.put(`/booking/1`).set("Authorization", "Bearer TOKENERRADO123");
        expect(result.statusCode).toBe(401);
    });

    it('should status 404 when room dont exists', async () => {
        const booking = await createBooking(user)
        const result = await api.put(`/booking/${booking.id}`).set("Authorization", token).send({ roomId: 20000 });
        expect(result.statusCode).toBe(404);
    });

    it('should status 403 when room is full', async () => {
        await processOfPayment(user, TicketStatus.PAID, false, true);
        const room = await createRoom();

        for (let i = 0; i < room.capacity; i++) {
            await prisma.booking.create({
                data: {
                    roomId: room.id,
                    userId: user.id
                }
            })
        }


        const room2 = await createRoom();
        const booking = await createBookingManual(room2.id, user.id);

        const result = await api.put(`/booking/${booking.id}`).set("Authorization", token).send({ roomId: room.id });

        expect(result.statusCode).toBe(403);
    });

    it('should status 404 when booking is invalid', async () => {
        const result = await api.put("/booking/777").set("Authorization", token).send({ roomId: 1 });
        expect(result.statusCode).toBe(404);
    });


    it('should status 200 and roomId', async () => {
        await processOfPayment(user, TicketStatus.PAID, false, true);
        const room = await createRoom();
        const room2 = await createRoom();
        const booking = await createBookingManual(room.id, user.id);

        const result = await api.put(`/booking/${booking.id}`).set("Authorization", token).send({ roomId: room2.id });

        expect(result.statusCode).toBe(200);
        expect(result.body).toMatchObject({ roomId: expect.any(Number) })
    });
});