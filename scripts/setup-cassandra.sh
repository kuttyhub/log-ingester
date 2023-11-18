#!/bin/bash

#Wait for Cassandra to be ready
# until cqlsh -e "DESC KEYSPACES;" > /dev/null 2>&1; do
#   echo "===== Wait for Cassandra to be ready ====="
#   sleep 2
# done
until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do
    sleep 5;
    echo "Waiting for cassandra...";
done

echo "Creating keyspace"
# Create keyspace and tables with proper indexing and sharding
cqlsh -e "CREATE KEYSPACE IF NOT EXISTS log_keyspace WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};"
cqlsh -e "USE log_keyspace;"


echo "Creating Table"
cqlsh -e "CREATE TABLE IF NOT EXISTS log_table (
  id TEXT PRIMARY KEY,
  level TEXT,
  message TEXT,
  resource_id TEXT,
  timestamp TIMESTAMP,
  trace_id TEXT,
  span_id TEXT,
  commit TEXT,
  metadata MAP<TEXT, TEXT>
);"


echo "Creating Indeces"
cqlsh -e "CREATE INDEX IF NOT EXISTS idx_level ON log_table(level);"
cqlsh -e "CREATE INDEX IF NOT EXISTS idx_resource_id ON log_table(resource_id);"
cqlsh -e "CREATE INDEX IF NOT EXISTS idx_log_timestamp ON log_table(timestamp);"

# Add additional indexes or modify the schema as needed

# Optional: Set the consistency level for the keyspace
cqlsh -e "CONSISTENCY log_keyspace ONE;"

# Optionally, seed some initial data if needed
# cqlsh -e "INSERT INTO log_table (id, level, message, resource_id, timestamp, trace_id, span_id, commit, metadata) VALUES (...);"