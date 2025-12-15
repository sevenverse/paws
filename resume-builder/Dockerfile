# Base image
FROM node:20-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install LaTeX (Minimal Scheme + Essential Packages)
# We use --no-install-recommends to keep size down, but we need enough for standard resume templates
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-latex-recommended \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
# If you are not using "output: standalone" in next.config.ts, copy .next and public
# For simplicity, we assume standard build. if 'output: standalone' is enabled, copying logic changes.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# We need to copy the public/static folders if standalone doesn't include them (it usually doesn't)
# Note: 'standalone' output is recommended for Docker. 
# We should ensure next.config.ts has "output: 'standalone'".

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is the entrypoint for standalone Next.js
CMD ["node", "server.js"]
