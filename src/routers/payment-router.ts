import paymentsController from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createPaymentSchema } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.get("/", authenticateToken, paymentsController.getPaymentInfo);
paymentRouter.post("/process", authenticateToken, validateBody(createPaymentSchema), paymentsController.create)

export { paymentRouter };
