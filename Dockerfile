FROM node:14.20 AS production

WORKDIR /world-graph

RUN npm install -g npm@6
RUN npm install -g typescript

COPY ./apps/backend/package.json ./apps/backend/package.json
COPY ./apps/frontend/package.json ./apps/frontend/package.json

RUN npm install --prefix ./apps/backend
RUN npm install --prefix ./apps/frontend

COPY ./apps ./apps

ENV NODE_ENV=production

RUN npm run build --prefix ./apps/frontend
RUN npm run build --prefix ./apps/backend

RUN cp -r ./apps/frontend/build ./apps/backend/build

WORKDIR /world-graph/apps/backend

CMD [ "npm", "start" ]
