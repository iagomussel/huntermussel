FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev"] 