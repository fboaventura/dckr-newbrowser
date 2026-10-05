# Docker file for serving a static web page using Caddy
# https://hub.docker.com/_/caddy/
# https://caddyserver.com/docs/caddyfile

# Use the official Caddy image
# https://hub.docker.com/_/caddy
FROM caddy:2-alpine

# Upgrade packages
RUN apk update && apk upgrade -l  \
    && rm -rf /var/cache/apk/*

ENV DOMAIN="localhost"
ENV BASEDIR="/app/www"
ENV CONFDIR="/app/conf"
ENV PORT="80"

ARG BUILD_DATE
ARG VCS_REF
ARG VENDOR
ARG VERSION

# Copy the Caddyfile and the site content into the container
COPY docker_files/Caddyfile /app/conf/Caddyfile
COPY www /app/www
COPY VERSION /app/VERSION

# Expose the same version used by the image metadata to the web UI. Fall back
# to the VERSION file so local Docker builds also display the correct release.
RUN release="${VERSION:-$(xargs < /app/VERSION)}" \
    && printf 'v%s\n' "$release" > /app/www/version.txt

CMD ["/usr/bin/caddy", "run", "--config", "/app/conf/Caddyfile", "--adapter", "caddyfile"]

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
