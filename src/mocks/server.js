import { setupServer } from "msw";
import { handlers } from "./handlers";

// This configures a request  mocking server with the given request
export const server = setupServer(...handlers);
