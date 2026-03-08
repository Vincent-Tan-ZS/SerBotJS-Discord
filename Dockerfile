## BUILDER - Install node_modules and esbuild the whole thing
FROM debian:bullseye-slim as builder

ARG NODE_VERSION=22.22.1

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

RUN mkdir /app
WORKDIR /app

COPY . .

# Use slim package.json, removing voice-related stuff to reduce memory usage even when idle
RUN mv package-slim.json package.json

RUN npm install
RUN npm run build

# Prune files from node_modules
RUN rm -rf node_modules/*/test \
    node_modules/*/tests \
    node_modules/*/docs \
    node_modules/*/example* \
    node_modules/.bin

# RUN mv lavalink.yml application.yml
# RUN apt-get update && \
#     apt-get install -y wget

# RUN wget https://github.com/lavalink-devs/Lavalink/releases/download/4.0.8/Lavalink.jar -O LavaLink.jar

## RUNTIME - Setup and run
FROM gcr.io/distroless/nodejs22-debian12

LABEL fly_launch_runtime="nodejs"

WORKDIR /app
COPY --from=builder /app/dist/bot.js ./bot.js
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV production

# Setup LavaLink
# RUN apt-get update && \
#     apt-get install -y openjdk-17-jre-headless

# EXPOSE 2333
# RUN apt-get update; apt install -y ffmpeg

CMD ["bot.js"]
