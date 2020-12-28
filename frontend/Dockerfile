FROM node:14-slim
WORKDIR /app
COPY package.json /app
RUN npm install
ADD ./ app/

EXPOSE 3000
CMD ["npm", "start"]