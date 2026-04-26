# Use Node.js lightweight image for Next.js
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for better Docker caching
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the full frontend project into the container
COPY . .

# Expose Next.js development port
EXPOSE 3000

# Start Next.js development server
CMD ["npm", "run", "dev"]