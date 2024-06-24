FROM node:alpine AS builder

WORKDIR /app

COPY package* .

RUN npm i

COPY . .

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY package* .

RUN npm i

COPY .env .

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./

CMD [ "npm", "start" ]