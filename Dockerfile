# Build Stage
FROM --platform=linux/amd64 node:22-alpine as build-stage

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN yarn install
COPY . .

RUN yarn build

# Deploy Stage
FROM --platform=linux/amd64 node:22-alpine as deploy

WORKDIR /opt/server

# Copy server files
COPY server ./  

RUN npm install

# Copy built files from build-stage
COPY --from=build-stage /app/dist ./dist

# Expose port and run server
EXPOSE 5003

CMD [ "node", "index.js" ]