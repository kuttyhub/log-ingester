import { Client, types } from "cassandra-driver";
import { Log } from "../models/log.model";

const contactPoints = ["cassandra", "localhost"];
const localDataCenter = "datacenter1";
const keyspace = "log_keyspace";

const client = new Client({
  contactPoints,
  localDataCenter,
  keyspace,
  pooling: {
    coreConnectionsPerHost: {
      [types.distance.local]: 2,
      [types.distance.remote]: 1,
    },
  },
  socketOptions: {
    readTimeout: 0,
  },
});

client
  .connect()
  .then(() => console.log("Connected to Cassandra"))
  .catch((err) => console.error("Error on Connection cassandra", err));

const insertIntoCassandra = async (id: string, log: Log) => {
  // Insert into Cassandra
  const cassandraQuery =
    "INSERT INTO log_table (id, level, message, resource_id, timestamp, trace_id, span_id, commit, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const cassandraParams = [
    id,
    log.level,
    log.message,
    log.resourceId,
    log.timestamp,
    log.traceId,
    log.spanId,
    log.commit,
    log.metadata,
  ];

  await client.execute(cassandraQuery, cassandraParams, {
    prepare: true,
  });
  console.info(`${id} : Inserted successfully in Cassandra`);
};

export { client as cassandraClient, insertIntoCassandra };
