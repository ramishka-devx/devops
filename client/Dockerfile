FROM node:22-alpine
WORKDIR /app
 
# Fix esbuild/react dev issues on Alpine (musl) by providing glibc compatibility
RUN apk add --no-cache libc6-compat

# Use deterministic installs when lockfile is present
COPY package*.json ./
RUN set -eux; \
	if [ -f package-lock.json ]; then npm ci; else npm install; fi; \
	# Ensure esbuild native binary matches the JS host version
	npm rebuild esbuild || true

# Copy the rest of the app sources
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]