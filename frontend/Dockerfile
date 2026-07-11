FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY src ./src

ARG VITE_API_BASE_URL=http://localhost:4000/api
ARG VITE_SOCKET_URL=http://localhost:4000

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

FROM node:24-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV PORT=4173

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
