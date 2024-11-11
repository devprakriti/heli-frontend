FROM --platform=linux/amd64 node:20.16.0 as build-stage
# RUN npm install --global yarn
# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependenciesenv
COPY package.json ./
RUN yarn install
COPY . .

RUN yarn build



EXPOSE 5003

CMD [ "node", "server.js" ]

