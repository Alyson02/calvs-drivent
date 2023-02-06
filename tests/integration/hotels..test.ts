import app, { init } from "@/app";
import { prisma } from "@/config";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createUser, createEnrollmentWithAddress, createTicketType, createTicket, createPayment } from "../factories";
import { User } from "@prisma/client";

const api = supertest(app);
let user: User = null;

beforeAll(async () => {
    await init();
    user = await createUser();
})

afterAll(async () => {
    console.log("Clean db");
    await cleanDb();
})

afterEach(async () => {
    await cleanDb();
    user = await createUser();
})



describe("GET /hotels/:id", () => {


    it("when not authenticate", async () => {
        const result = await api.get("/hotels");
        expect(result.statusCode).toBe(401);
    });

    it("when token is invalid", async () => {
        const result = await api.get(`/hotels/12`).set("Authorization", "Bearer TOKENERRADO123");
        expect(result.statusCode).toBe(401);
    });

    it("when not included hodel", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const hotel = await prisma.hotel.create({
            data: {
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/c8/f7/e8/hotel.jpg?w=1200&h=-1&s=1",
                name: "Pullman "
            }
        });

        const result = await api.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    })

    it("when is online", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: true,
                includesHotel: false,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get(`/hotels/12`).set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    })

    it("when ticket not paid", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get(`/hotels/12`).set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    });

    it("when tickect or enrollment not exist", async () => {
        const result = await api.get(`/hotels/12`).set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(404);
    });

    it("should respond with status 200 and with hotel data", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const hotel = await prisma.hotel.create({
            data: {
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/c8/f7/e8/hotel.jpg?w=1200&h=-1&s=1",
                name: "Pullman "
            }
        });

        const result = await api.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    })

    it("should respond with status 404 when dont find hotel", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get("/hotels/20203").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        console.log(result.body);
        expect(result.status).toBe(404);
    })

})

describe("GET /hotels", () => {

    it("when not authenticate", async () => {
        const result = await api.get("/hotels");
        expect(result.statusCode).toBe(401);
    });

    it("when token is invalid", async () => {
        const result = await api.get("/hotels").set("Authorization", "Bearer TOKENERRADO123");
        expect(result.statusCode).toBe(401);
    });

    it("when not included hodel", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    })

    it("when is online", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: true,
                includesHotel: false,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    })

    it("when ticket not paid", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(402);
    });

    it("when tickect or enrollment not exist", async () => {
        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(404);
    });

    it("should respond with status 200 and with hotels data", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        await prisma.hotel.create({
            data: {
                image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/c8/f7/e8/hotel.jpg?w=1200&h=-1&s=1",
                name: "Pullman "
            }
        });

        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        })]))
    })

    it("should respond with status 200 and with hotels data empty", async () => {
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await prisma.ticketType.create({
            data: {
                name: "Not included hotel",
                price: 250,
                isRemote: false,
                includesHotel: true,
            },
        });
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
        const payment = await createPayment(ticket.id, ticketType.price);

        const result = await api.get("/hotels").set("Authorization", `Bearer ${await generateValidToken(user)}`);
        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body).toEqual([]);
    })
})