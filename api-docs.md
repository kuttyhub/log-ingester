Certainly! Below is an example of how you can structure your API documentation using Markdown for both the GET and POST endpoints:

## Log Ingestor API Documentation

### Base URL: `http://localhost:3000`

---

### GET Logs

#### Endpoint: `/`

#### Query Parameters:

- `search` (Optional): Full-text search query.
- `level` (Optional): Log level filter.
- `resourceId` (Optional): Log resource ID filter.
- `traceId` (Optional): Log trace ID filter.
- `spanId` (Optional): Log span ID filter.
- `commit` (Optional): Log commit filter.
- `parentResourceId` (Optional): Log parent resource ID filter.
- `startDateTime` (Optional): Start date and time for date range query (format: `YYYY-MM-DDTHH:mm:ssZ`).
- `endDateTime` (Optional): End date and time for date range query (format: `YYYY-MM-DDTHH:mm:ssZ`).

### GET Logs - Example `curl` Request

```bash
curl -X GET "http://localhost:3000/?search=error&level=warn&resourceId=server-123&startDateTime=2023-09-01T00:00:00Z&endDateTime=2023-09-10T23:59:59Z" \
  -H "Content-Type: application/json"
```

#### Example Response:

```json
{
  "timeTook": "44ms",
  "data": [
    {
      "level": "error",
      "message": "Failed to connect to DB",
      "resourceId": "server-123",
      "timestamp": "2023-09-05T08:00:00Z",
      "traceId": "abc-xyz-123",
      "spanId": "span-456",
      "commit": "5e5342f",
      "metadata": {
        "parentResourceId": "server-0987"
      }
    }
    // ... other log entries
  ]
}
```

#### Notes:

- If no query parameters are provided, the endpoint fetches the most recent log records.
- The `startDateTime` and `endDateTime` parameters are optional for date range queries.
- The maximum fetch size is set to 100.

---

### POST Logs

#### Endpoint: `/`

#### Request Body:

- Log data in the specified format.

```json
{
  "level": "error",
  "message": "Failed to connect to DB",
  "resourceId": "server-123",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-0987"
  }
}
```

### POST Logs - Example `curl` Request

```bash
curl -X POST "http://localhost:3000/" \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-123",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  }'
```

#### Example Response:

```json
{
  "message": "Log ingested successfully"
}
```

#### Notes:

- The log data should be sent in the specified JSON format.
- A successful response indicates that the log has been successfully ingested.
