FROM node:18.12.1
WORKDIR /app
ENV ME_API_URL="https://api-mainnet.magiceden.dev/v2"
COPY . .

RUN yarn install
ENTRYPOINT node script.js
