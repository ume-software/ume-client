FROM node:19.7-bullseye AS builder
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@ume/client --docker

FROM node:19.7-bullseye AS optimizer
# Ser working directory
WORKDIR /app

COPY --from=builder /app/out/json .
COPY --from=builder /app/out/full/ .
RUN find . \! -name "package.json"  -type f -print | xargs rm
COPY --from=builder /app/out/yarn.lock ./yark.lock
# COPY ./.npmrc .npmrc
COPY ./.gitignore .gitignore
COPY ./turbo.json turbo.json

# Add lockfile and package.json's of isolated subworkspace
FROM node:19.7-bullseye AS installer
WORKDIR /app
COPY --from=optimizer /app/ .


# turbo filter: https://turborepo.org/docs/core-concepts/filtering
RUN yarn turbo run build --filter=@@ume/client... --concurrency 10

FROM node:16.17-bullseye-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/client/next.config.js .
COPY --from=installer /app/apps/client/package.json .
COPY --from=installer /app/apps/client/public ./apps/clientl/public

COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static

EXPOSE 3000
CMD node apps/client/server.js
