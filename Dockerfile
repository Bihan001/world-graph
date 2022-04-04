FROM node:14.16-alpine3.10 as production

WORKDIR /app

RUN npm install -g typescript

COPY ./backend/package.json ./backend/package.json
COPY ./frontend/package.json ./frontend/package.json

WORKDIR /app/backend

RUN NPM_CONFIG_PRODUCTION=false npm install

WORKDIR /app/frontend

RUN npm install

COPY ./backend /app/backend
COPY ./frontend /app/frontend

RUN npm run build

RUN mv ./build /app/backend

WORKDIR /app/backend

RUN tsc -p .

# ENV NODE_ENV=production
# ENV PORT=5000
# ENV MONGODB_URI=mongodb+srv://kaisen:kaisen@kaisen-test-cluster.hllyu.mongodb.net/test-db?retryWrites=true&w=majority
# ENV FIREBASE_URI=https://mern-authentication-6634c.firebaseio.com
# ENV SERVICE_ACCOUNT_PATH=/app/serviceAccount.json


CMD [ "npm", "start" ]
