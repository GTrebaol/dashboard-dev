FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installer les dépendances (profite du cache layer)
COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

# Copier les sources et builder
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
RUN pnpm --filter @dashboard/shared build
RUN pnpm --filter backend exec prisma generate
RUN pnpm --filter backend build

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
