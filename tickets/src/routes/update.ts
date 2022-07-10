import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@mpena/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.put("/api/tickets/:id", async (req: Request, res: Response) => {});

export { router as updateTicketRouter };
