# Docker file for serving a static web page using Caddy
# https://hub.docker.com/_/caddy/
# https://caddyserver.com/docs/caddyfile

# Use the official Caddy image
# https://hub.docker.com/_/caddy
FROM caddy:2-alpine

# Upgrade packages
RUN apk update && apk upgrade \
    && rm -rf /var/cache/apk/*

ENV DOMAIN="localhost"
ENV BASEDIR="/app/www"
ENV CONFDIR="/app/conf"
ENV PORT="80"

# Copy the Caddyfile and the site content into the container
COPY docker_files/Caddyfile /app/conf/Caddyfile
COPY www /app/www

CMD ["/usr/bin/caddy", "run", "--config", "/app/conf/Caddyfile", "--adapter", "caddyfile"]
