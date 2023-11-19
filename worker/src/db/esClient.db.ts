import { Client as ESClient } from "@elastic/elasticsearch";
import { Log } from "../models/log.model";

const host = process.env.ELASTICSEARCH_HOST || "localhost:9200";

const esClient = new ESClient({
  node: `http://${host}`,
  auth: {
    username: "elastic",
    password: "changeme",
  },
});

esClient
  .ping(undefined, {
    requestTimeout: 30000,
  })
  .then(() => console.log("Success! Elasticsearch cluster is up!"))

const insertIntoES = async (id: string, log: Log) => {
  // Insert into Elasticsearch
  const esIndex = "log_table";
  const esDocument = {
    index: esIndex,
    id: id,
    body: {
      level: log.level,
      message: log.message,
      resourceId: log.resourceId,
      timestamp: log.timestamp,
      traceId: log.traceId,
      spanId: log.spanId,
      commit: log.commit,
      metadata: log.metadata,
    },
  };
  await esClient.index(esDocument);
  console.log(`${id} : Inserted successfully in es`);
};

export { esClient, insertIntoES };
