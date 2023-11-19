
CREATE KEYSPACE IF NOT EXISTS log_keyspace WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE log_keyspace;

CREATE TABLE IF NOT EXISTS log_table (
  id TEXT PRIMARY KEY,
  level TEXT,
  message TEXT,
  resource_id TEXT,
  timestamp TIMESTAMP,
  trace_id TEXT,
  span_id TEXT,
  commit TEXT,
  metadata MAP<TEXT, TEXT>
);


CREATE INDEX IF NOT EXISTS idx_level ON log_table(level);
CREATE INDEX IF NOT EXISTS idx_resource_id ON log_table(resource_id);
CREATE INDEX IF NOT EXISTS idx_log_timestamp ON log_table(timestamp);

CONSISTENCY log_keyspace ONE;

DESCRIBE keyspaces;
