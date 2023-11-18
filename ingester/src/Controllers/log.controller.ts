// log.routes.ts
import { Request, Response } from "express";
import { publishLog } from "../kafka-producer";
import { Log } from "../models/log.model";

const logController = (req: Request, res: Response) => {
  const log: Log = req.body;
  publishLog(log);
  res.status(201).json({ message: "Log ingested successfully" });
};

export { logController };
