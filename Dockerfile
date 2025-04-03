# 1. Base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json files
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of the project files into the container
COPY . .

# 6. Build the application (compile TypeScript to JavaScript)
RUN npm run build

# 7. Run seed script first, then start the main application
CMD ["sh", "-c", "node dist/seed/seed.js && node dist/main"]

# 8. Expose port 3000 to the host
EXPOSE 3000

