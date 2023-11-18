import { Log } from "./models/log.model";
import { Kafka, Message, Partitioners } from "kafkajs";

const host = process.env.KAFKA_HOST || "localhost:29092";

const kafka = new Kafka({
  clientId: "log-pusher",
  brokers: [host],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const initKafkaProducer = async () => {
  await producer
    .connect()
    .then(() => console.log("Kafka Producer is ready"))
    .catch((err) => console.error("Error in Kafka Producer:", err));

  return producer;
};

const publishLog = (log: Log) => {
  const payloads: Message[] = [{ value: JSON.stringify(log) }];

  producer
    .send({
      topic: "log-topic",
      messages: payloads,
    })
    .then((data) => console.log("Message sent successfully"))
    .catch((err) => console.error("Error sending message to Kafka:", err));
};

export { initKafkaProducer, publishLog };
