import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@mpena/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  //order not found
  if (!order) {
    throw new NotFoundError();
  }

  //order user id doesn't equal user's id - not authorized to view
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
