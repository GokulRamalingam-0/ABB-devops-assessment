FROM node:20-alpine
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production   # works without package-lock.json

COPY app.js .
EXPOSE 80
CMD ["node", "app.js"]