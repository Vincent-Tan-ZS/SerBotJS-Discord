## Install node_modules
FROM debian:bullseye as builder

ARG NODE_VERSION=18.20.4

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

RUN mkdir /app
WORKDIR /app

# NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# to install all modules: "npm install --production=false".
# Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description
ENV NODE_ENV production

COPY . .

RUN rm -rf node_modules txt .dockerignore .gitignore Dockerfile README.md replace.js replace.txt package-lock.json
RUN npm install

# RUN mv lavalink.yml application.yml
# RUN apt-get update && \
#     apt-get install -y wget

# RUN wget https://github.com/lavalink-devs/Lavalink/releases/download/4.0.8/Lavalink.jar -O LavaLink.jar

## Setup and run
FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

# Setup LavaLink
# RUN apt-get update && \
#     apt-get install -y openjdk-17-jre-headless

# EXPOSE 2333
# RUN apt-get update; apt install -y ffmpeg

CMD npm run start
