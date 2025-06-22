#!/bin/sh

# This script is the entrypoint for the Docker container.
# It ensures that the database is seeded before the application starts.

echo "Waiting for MongoDB to be ready..."
# A simple delay to allow the database container to initialize.
# For a more robust solution in production, consider using a tool like wait-for-it.sh
sleep 5

echo "Running database seed script..."
# Use the MONGO_URI from the environment to connect and seed the database.
node scripts/seed.js

echo "Starting the application..."
# Execute the main container command (CMD in Dockerfile).
exec "$@" 