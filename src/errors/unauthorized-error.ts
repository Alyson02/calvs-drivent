import { ApplicationError } from "@/protocols";

export function unauthorizedError(message: string = "You must be signed in to continue"): ApplicationError {
  return {
    name: "UnauthorizedError",
    message: message,
  };
}
