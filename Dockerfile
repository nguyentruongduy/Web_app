# 1. Base Image
# Use an official Node.js runtime as a parent image.
# We're using the Alpine Linux variant for a smaller image size.
FROM node:18-alpine

# 2. Set Working Directory
# Create and set the working directory inside the container.
WORKDIR /usr/src/app

# 3. Copy package files
# Copy package.json and package-lock.json to leverage Docker's layer caching.
# This way, dependencies are only re-installed if these files change.
COPY package*.json ./

# 4. Install Dependencies
# Install project dependencies.
RUN npm install

# 5. Copy Application Code & Scripts
# Copy the rest of your application's source code.
COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# 6. Expose Port
# Make port 3000 available to the host. This is the port your Express app runs on.
EXPOSE 3000

# 7. Entrypoint
# Set the entrypoint to our custom script.
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

# 8. Start Command
# Define the default command to run your app. This is passed to the entrypoint.
CMD [ "node", "server.js" ] 