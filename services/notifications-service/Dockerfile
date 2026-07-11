FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./

ENV NODE_ENV=production
ENV PORT=4010
ENV NOTIFICATIONS_PORT=4010

EXPOSE 4010

CMD ["node", "server.js"]
