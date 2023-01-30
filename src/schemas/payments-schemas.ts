import { CreatePaymentFormated } from "@/services/payment-service";
import Joi from "joi";


export const createPaymentSchema = Joi.object<CreatePaymentFormated>({
    cardData: Joi.object({
        issuer: Joi.string(),
        number: Joi.number(),
        name: Joi.string(),
        expirationDate: Joi.string(),
        cvv: Joi.string()
    }).required(),
    ticketId: Joi.number().required()
}) 