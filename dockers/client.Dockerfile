FROM node:20-alpine

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=1024

# https://github.com/vercel/turbo/issues/2198
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# add turborepo
RUN yarn global add turbo

WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY . .

# Install dependencies
RUN yarn install 
RUN yarn build:client

WORKDIR /app/apps/client

# Expose the port your application listens on (assuming it's 3000)
EXPOSE 3000

# Use Turbo to start your production application
CMD ["yarn", "start"]
