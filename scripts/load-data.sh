#!/bin/bash

# Check if jq is installed, and if not, try to install it
if ! command -v jq &>/dev/null; then
    echo "jq is not installed. Attempting to install..."

    # Check the package manager and install jq accordingly
    if command -v apt-get &>/dev/null; then
        sudo apt-get update
        sudo apt-get install -y jq
    elif command -v yum &>/dev/null; then
        sudo yum install -y jq
    else
        echo "Unsupported package manager. Please install jq manually."
        exit 1
    fi
fi

# Check if curl is installed, and if not, try to install it
if ! command -v curl &>/dev/null; then
    echo "curl is not installed. Attempting to install..."

    # Check the package manager and install curl accordingly
    if command -v apt-get &>/dev/null; then
        sudo apt-get update
        sudo apt-get install -y curl
    elif command -v yum &>/dev/null; then
        sudo yum install -y curl
    else
        echo "Unsupported package manager. Please install curl manually."
        exit 1
    fi
fi

# Continue with the rest of the script...

# Replace 'your_json_file.json' with the actual JSON file name
JSON_FILE="your_json_file.json"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "JSON file not found: $JSON_FILE"
    exit 1
fi

# Initialize counters
successful_requests=0
failed_requests=0

# Record start time
start_time=$(date +%s)

# Read JSON file and iterate over entries
jq -c '.[]' "$JSON_FILE" | while read -r entry; do
    # Make POST request to localhost:3000
    response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$entry" http://localhost:3000)

    # Extract the HTTP status code from the response
    http_status=$(echo "$response" | tail -n1)

    # Check if the request was successful (status code 2xx)
    if [[ $http_status =~ ^2[0-9][0-9]$ ]]; then
        ((successful_requests++))
    else
        ((failed_requests++))
    fi
done

# Record end time
end_time=$(date +%s)

# Calculate execution time
execution_time=$((end_time - start_time))

# Display analytics information
echo "Execution time: $execution_time seconds"
echo "Successful requests: $successful_requests"
echo "Failed requests: $failed_requests"

echo "POST requests completed for each entry in $JSON_FILE"
