import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import { initKafkaProducer } from "./kafka-producer";
import { cassandraClient } from "./db/cassandra.db";
import { Producer } from "kafkajs";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/", routes);

let producer: Producer;

app.listen(port, async () => {
  producer = await initKafkaProducer();
  console.log(`Log Ingestor server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await producer.disconnect();
  await cassandraClient.shutdown();

  process.exit();
});
