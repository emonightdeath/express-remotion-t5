# Use the official Node.js 20-bookworm image as the base image
FROM node:20-bookworm

# Install necessary dependencies
RUN apt-get update && apt-get install -y chromium

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json, yarn.lock (or other lock files), and configuration files to the working directory
COPY package.json package*.json yarn.lock* pnpm-lock.yaml* bun.lockb* tsconfig.json* remotion.config.* ./

# If you have a public folder, copy it to the working directory
COPY public ./public

# Copy the application source code (assuming it's in a 'src' directory)
COPY src ./src

# Install dependencies using npm (you can adjust based on your preferred package manager)
RUN npm install

# Copy your specific render script to the working directory
COPY app.js .

# Expose the port if your application needs to listen on a specific port (adjust as necessary)
EXPOSE 8080

# Command to run your application (adjust the command based on how you start your application)
CMD ["node", "app.js"]
