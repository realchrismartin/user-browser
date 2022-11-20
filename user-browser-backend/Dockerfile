FROM node:16
WORKDIR /usr/src/app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
EXPOSE 8080
CMD ["npm","start"]