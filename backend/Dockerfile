# 1. Use an official, lightweight runtime as a parent image
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

COPY .env ./env
# 4. Install production dependencies
RUN npm ci --only=production

# 5. Copy the rest of your app's source code
COPY . .

# 6. Document the port the container listens on at runtime
EXPOSE 5000

# 7. Define the command to run your app
CMD ["node", "src/server.js"]
