import { prisma } from "@/config"
import { Payment } from "@prisma/client"

async function create(payment: CreatePayment) {
    return await prisma.payment.create({ data: payment });
}

async function getPaymentInfo(ticketId: number) {
    return await prisma.payment.findFirst({ where: { ticketId: ticketId } });
}

export default {
    create,
    getPaymentInfo
}

export type CreatePayment = Omit<Payment, "id" | "createdAt" | "updatedAt">