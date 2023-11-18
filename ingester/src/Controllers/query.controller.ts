// query.routes.ts
import { Request, Response } from "express";
import { cassandraClient } from "../db/cassandra.db";
import { esClient } from "../db/esClient.db";

// Middleware for sanitizing input
const sanitizeInput = (input: string) => {
  return input.replace(/[^\w\s-:.]/gi, ""); // Sanitize to allow only alphanumeric, spaces, dashes, colons, and dots
};

const queryController = async (req: Request, res: Response) => {
  try {
    let esLogIds = [];
    const startTime = performance.now();

    let response = {
      timeTook: "0ms",
      data: [] as any,
    };

    // Full-text search
    const searchText: string | undefined = req.query.search as string;
    if (searchText) {
      esLogIds = await getElasticsearchLogs(searchText);

      if (esLogIds.length === 0) {
        const endTime = performance.now();
        response.timeTook = `${endTime - startTime}ms`;

        res.json(response);
        return;
      }
    }
    const cassandraLogs = await getCassandraLogs(req.query, esLogIds);

    response.data = cassandraLogs;

    const endTime = performance.now();
    response.timeTook = `${endTime - startTime}ms`;

    res.json(response);
  } catch (error) {
    console.error("Error querying Cassandra:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCassandraLogs = async (queryParams: any, esLogIds: any) => {
  const { query, params } = buildCassandraQuery(queryParams, esLogIds);

  const result = await cassandraClient.execute(query, params, {
    prepare: true,
    fetchSize: 100,
  });
  return result.rows;
};

const getElasticsearchLogs = async (searchText: string) => {
  const esResult = await esClient.search({
    index: "log_table",
    body: {
      query: {
        query_string: {
          query: sanitizeInput(searchText),
        },
      },
    },
  });

  const esLogIds = esResult.body.hits.hits.map((hit: any) => hit._id);

  return esLogIds;
};

const buildCassandraQuery = (queryParams: any, esLogIds: any) => {
  let query = "SELECT * FROM log_table WHERE ";
  const params: any[] = [];

  if (esLogIds.length > 0) {
    query += `id IN ? AND `;
    params.push(esLogIds);
  }

  const filters: { [key: string]: string | undefined } = {
    level: queryParams.level as string,
    resourceId: queryParams.resourceId as string,
    traceId: queryParams.traceId as string,
    spanId: queryParams.spanId as string,
    commit: queryParams.commit as string,
    "metadata.parentResourceId": queryParams.parentResourceId as string,
  };

  for (const filter in filters) {
    const value = filters[filter];
    if (value) {
      query += `${filter} = ? AND `;
      params.push(sanitizeInput(value));
    }
  }

  const startDateTime: string | undefined = queryParams.startDateTime as string;
  const endDateTime: string | undefined = queryParams.endDateTime as string;
  if (startDateTime && endDateTime) {
    query += "timestamp >= ? AND timestamp <= ? ALLOW FILTERING;";
    params.push(new Date(startDateTime), new Date(endDateTime));
  }

  // Remove trailing 'AND'
  query = query.replace(/AND\s*$/, "");
  // Remove trailing 'WHERE' when there is no query
  query = query.replace(/WHERE\s*$/, "");

  return { query, params };
};

export { queryController };
