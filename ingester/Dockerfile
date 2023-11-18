FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:18 AS server
WORKDIR /app

COPY --from=builder  ./app/package*.json .
RUN npm ci --omit=dev
RUN npm install pm2 -g
COPY --from=builder ./app/dist .
EXPOSE 3000

CMD ["pm2-runtime","app.js"]
