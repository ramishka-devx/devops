FROM node:22-slim
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN set -eux; \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi; \
    npm rebuild esbuild || true

# Copy source
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]