FROM node:24-alpine

# setup conclock
COPY . /app
WORKDIR /app
RUN npm ci --omit=dev

# run conclock
CMD ["npm", "start"]
