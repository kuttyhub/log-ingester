// kafka-consumer.ts
import { EachMessageHandler, Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

import { Log } from "./models/log.model";
import { insertIntoCassandra } from "./db/cassandra.db";
import { insertIntoES } from "./db/esClient.db";

const host = process.env.KAFKA_HOST || "localhost:29092";

const kafka = new Kafka({
  clientId: "db-worker",
  brokers: [host],
});

const startConsume = async () => {
  const consumer = kafka.consumer({ groupId: "query-interface-group" });
  await consumer.connect();
  await consumer
    .subscribe({ topic: "log-topic", fromBeginning: true })
    .then(() => console.log("subscribed to topic"));

  await consumer.run({
    eachMessage: publishToDbs,
  });

  return consumer;
};

const publishToDbs: EachMessageHandler = async ({ message }) => {
  if (!message.value) {
    console.log("Invalid message Value", message);
    return;
  }

  const log: Log = JSON.parse(message.value.toString());
  console.log("Kafka Consumer received ->", log);

  const id = uuidv4();

  try {
    insertIntoCassandra(id, log);
    insertIntoES(id, log);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

export { startConsume };
