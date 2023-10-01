# Use a Node.js 16 Alpine base image
FROM node:16-alpine

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Install the required system dependencies (libc6-compat)
RUN apk add --no-cache libc6-compat

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY ["package.json", "yarn.lock", "./"]

# Install dependencies
RUN yarn install --production

# Copy the rest of your application files
COPY . .

# Expose the port your application listens on (assuming it's 3000)
EXPOSE 3000

# Use Turbo to start your production application
CMD ["yarn", "turbo", "start"]
