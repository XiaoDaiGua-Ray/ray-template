FROM debian:11
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y wget curl make sudo unzip
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm i -g pnpm
RUN pnpm install
EXPOSE 9527
CMD [ "pnpm", "dev" ]
