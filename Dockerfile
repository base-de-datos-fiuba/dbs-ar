# syntax=docker/dockerfile:1.7

ARG RELAX_REF=development

FROM node:20-bookworm-slim AS build
ARG RELAX_REF

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates patch \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

RUN git clone --depth 1 --branch "${RELAX_REF}" \
    https://github.com/dbis-uibk/relax.git .

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    corepack enable \
    && corepack prepare yarn@1.22.22 --activate \
    && yarn install --frozen-lockfile

COPY datasets/local_groups src/calc2/data/steam.txt
COPY patches/register-steam-dataset.patch /tmp/register-steam-dataset.patch

RUN patch -p1 < /tmp/register-steam-dataset.patch

RUN NODE_OPTIONS=--openssl-legacy-provider yarn build --no-progress

FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /src/dist/ /usr/share/nginx/html/relax/
COPY college/college-mode.css /usr/share/nginx/html/relax/college-mode.css
COPY college/college-mode.js /usr/share/nginx/html/relax/college-mode.js
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/relax/ >/dev/null || exit 1
