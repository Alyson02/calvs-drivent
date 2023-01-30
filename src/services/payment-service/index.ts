import { CreatePayment } from "@/repositories/payment-repository"
import paymentRepository from "@/repositories/payment-repository"
import ticketService from "../ticket-service"
import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";


async function create(payment: CreatePaymentFormated, userId: number): Promise<Payment> {

    const ticketExist = await ticketService.getTicketById(payment.ticketId);

    if (ticketExist === null) throw notFoundError();

    const ticket = await ticketService.getTickets(userId);

    if (ticket === null) throw unauthorizedError("Não foi encontrado nenhum ticket")

    const createPayment: CreatePayment = {
        cardIssuer: payment.cardData.issuer,
        cardLastDigits: payment.cardData.number.toString().slice(-4),
        ticketId: payment.ticketId,
        value: ticket.TicketType.price,
    }

    const paymentCreated = await paymentRepository.create(createPayment)

    await ticketService.paidTicket(paymentCreated.ticketId);

    return paymentCreated;
}

export type CreatePaymentFormated = {
    ticketId: number,
    cardData: cardData
}

type cardData = {
    issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
}

async function getPaymentInfo(ticketId: number, userId: number): Promise<Payment> {
    const ticketExistis = await ticketService.getTicketById(ticketId);
    if (ticketExistis === null) throw notFoundError()

    const ticket = await ticketService.getTicketByIdAndUser(ticketId, userId);
    if (ticket === null) throw unauthorizedError("Esse ticket não te pertence");

    const paymentInfo = await paymentRepository.getPaymentInfo(ticketId);

    return paymentInfo
}

export default {
    create,
    getPaymentInfo
}