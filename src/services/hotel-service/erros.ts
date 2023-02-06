import { ApplicationError } from "@/protocols";

export function paymentRequired(message: string): ApplicationError {
    return {
        name: "PaymentRequired",
        message
    }
}