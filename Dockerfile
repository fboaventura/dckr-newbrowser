# Docker file for serving a static web page using Caddy
# https://hub.docker.com/_/caddy/
# https://caddyserver.com/docs/caddyfile

# Use the official Caddy image
# https://hub.docker.com/_/caddy
FROM caddy:2.9-alpine

# Upgrade packages
RUN apk update && apk upgrade -l  \
    && rm -rf /var/cache/apk/*

ENV DOMAIN="localhost"
ENV BASEDIR="/app/www"
ENV CONFDIR="/app/conf"
ENV PORT="80"

# Copy the Caddyfile and the site content into the container
COPY docker_files/Caddyfile /app/conf/Caddyfile
COPY www /app/www

CMD ["/usr/bin/caddy", "run", "--config", "/app/conf/Caddyfile", "--adapter", "caddyfile"]

ARG BUILD_DATE
ARG VCS_REF
ARG VENDOR
ARG VERSION

LABEL \
      org.opencontainers.image.authors="Frederico Freire Boaventura" \
      org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.description="Quick page to install frequently used extensions in browsers" \
      org.opencontainers.image.documentation="https://github.com/fboaventura/dckr-newbrowser/README.md" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.source="https://github.com/fboaventura/dckr-newbrowser" \
      org.opencontainers.image.title="fboaventura/dckr-newbrowser" \
      org.opencontainers.image.url="https://fboaventura.dev" \
      org.opencontainers.image.vendor="Frederico Freire Boaventura" \
      org.opencontainers.image.version="v$VERSION"
