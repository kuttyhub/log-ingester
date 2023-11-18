import { Client, types } from "cassandra-driver";

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

export { client as cassandraClient };
