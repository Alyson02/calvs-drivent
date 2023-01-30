import { CreateTicketParams } from "@/services";
import Joi from "joi";

export const createTicketSchema = Joi.object<CreateTicketParams>({
    ticketTypeId: Joi.number().required()
});
