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

# Set up Nginx
RUN apt-get update && apt-get install -y nginx

# Copy nginx.conf from etc/nginx/nginx.conf to /etc/nginx/nginx.conf inside the container
COPY etc/nginx/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80
EXPOSE 8080

# Install supervisor
RUN apt-get install -y supervisor

# Copy supervisord.conf to /etc/supervisor/conf.d/supervisord.conf inside the container
COPY etc/supervisor/conf.d/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Define the command to run supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
