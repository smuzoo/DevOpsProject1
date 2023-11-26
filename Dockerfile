# Use the official Node.js image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Copy nginx.conf from etc/nginx/nginx.conf to /etc/nginx/nginx.conf inside the container
COPY etc/nginx/nginx.conf /etc/nginx/nginx.conf

ENV PORT=8080

# Expose the port on which your app will run
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "start"]
