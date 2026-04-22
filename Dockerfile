# 1. Use the ultra-lightweight NGINX web server
FROM nginx:alpine

# 2. Copy your custom NGINX configuration file 
COPY nginx.conf /etc/nginx/nginx.conf

# 3. Copy your HTML, CSS, and JS files into NGINX's default public folder
COPY . /usr/share/nginx/html

# 4. Expose the standard web port
EXPOSE 80