FROM node:24-alpine

# setup conclock
COPY . /app
#ADD ? /app/app
WORKDIR /app
RUN npm install

# run conclock
CMD ["npm", "start"]
