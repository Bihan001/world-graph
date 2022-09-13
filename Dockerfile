FROM node:14.20 as production

WORKDIR /app

RUN npm install -g npm
RUN npm install -g typescript

COPY package.json package-lock.json ./
COPY ./apps/backend/package.json ./apps/backend/package.json
COPY ./apps/frontend/package.json ./apps/frontend/package.json

RUN npm install

COPY ./apps /app/apps
COPY ./turbo.json /app/turbo.json

ENV NODE_ENV=production

RUN npm run turbo:build

RUN cp ./apps/frontend/build ./apps/backend/build

# ENV PORT=5000
# ENV MONGODB_URI=mongodb+srv://kaisen:kaisen@kaisen-test-cluster.hllyu.mongodb.net/test-db?retryWrites=true&w=majority
# ENV FIREBASE_URI=https://mern-authentication-6634c.firebaseio.com
# ENV SERVICE_ACCOUNT_PATH=/app/serviceAccount.json

CMD [ "npm", "run", "turbo:start" ]
