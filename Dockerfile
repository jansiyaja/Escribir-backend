FROM node:20-alpine

WORKDIR /app

# Copy both package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
