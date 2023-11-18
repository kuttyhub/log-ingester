import express from "express";
import { cassandraClient } from "./db/cassandra.db";
import { Consumer } from "kafkajs";
import { startConsume } from "./kafka-consumer";

const app = express();
const port = 4000;

app.use("/", async (_req, res, _next) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthCheck);
  } catch (error) {
    healthCheck.message = error as string;
    res.status(503).send(healthCheck);
  }
});

let consumer: Consumer;

app.listen(port, async () => {
  consumer = await startConsume();
  console.log(`Log Worker server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await consumer.disconnect();
  await cassandraClient.shutdown();

  process.exit();
});
