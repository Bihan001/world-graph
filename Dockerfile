FROM node:14.20 as production

WORKDIR /world-graph

RUN npm install -g npm
RUN npm install -g typescript

COPY package.json package-lock.json ./
COPY ./apps/backend/package.json ./apps/backend/package.json
COPY ./apps/frontend/package.json ./apps/frontend/package.json

RUN npm install

COPY ./apps ./apps
COPY ./turbo.json ./turbo.json

ENV NODE_ENV=production

RUN npm run turbo:build

RUN cp -r ./apps/frontend/build ./apps/backend/build

# CMD [ "npm", "run", "turbo:start" ]
