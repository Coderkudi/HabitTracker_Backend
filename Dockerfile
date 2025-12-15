# FROM oven/bun:latest

# WORKDIR /HabitTracker_Backend

# COPY package*.json ./

# RUN bun install

# COPY . .

# EXPOSE 5432

# CMD ["bun", "dev"]

FROM oven/bun:1.1.13 AS builder

WORKDIR /HabitTracker_Backend

COPY bun.lock package.json ./
RUN bun install --frozen-lockfile


COPY prisma ./prisma
RUN bunx prisma generate

COPY tsconfig*.json ./
COPY index.ts ./
COPY src ./src
COPY types ./types

RUN bun run build


FROM oven/bun:1.1.13-slim

WORKDIR /HabitTracker_Backend


COPY --from=builder /HabitTracker_Backend/dist ./dist
COPY --from=builder /HabitTracker_Backend/node_modules ./node_modules
# COPY --from=builder /HabitTracker_Backend/prisma ./prisma
# COPY --from=builder /HabitTracker_Backend/generated ./generated
COPY package.json ./

ENV NODE_ENV=production

EXPOSE 8000

CMD ["bun", "dist/index.js"]
