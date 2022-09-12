import express, { Request, Response } from "express";
import { requireAuth } from "@mpena/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  //get all orders from user
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');

  //send back orders
  res.send({orders});
});

export { router as indexOrderRouter };
