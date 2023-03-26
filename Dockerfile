FROM node:19.7
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8000

CMD ["npm", "start"]
