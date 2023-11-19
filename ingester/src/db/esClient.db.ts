import { Client as ESClient } from "@elastic/elasticsearch";

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
  .then(() => console.log("Success! Elasticsearch cluster is up!"));

export { esClient };
