FROM node:14.16-alpine3.10 as production

WORKDIR /app

RUN npm install -g typescript

COPY ./backend ./backend
COPY ./frontend ./frontend

WORKDIR /app/backend

RUN NPM_CONFIG_PRODUCTION=false npm install && tsc -p .

WORKDIR /app/frontend

RUN npm install && npm run build

RUN mv ./build /app/backend

WORKDIR /app/backend

# ENV NODE_ENV=production
# ENV PORT=5000
# ENV MONGODB_URI=mongodb+srv://kaisen:kaisen@kaisen-test-cluster.hllyu.mongodb.net/test-db?retryWrites=true&w=majority
# ENV FIREBASE_URI=https://mern-authentication-6634c.firebaseio.com
# ENV SERVICE_ACCOUNT_PATH=/app/serviceAccount.json


CMD [ "npm", "start" ]
