import express, { Application, Request, Response, NextFunction } from 'express';
const app: Application = express();
import cors from 'cors';
import morgan from 'morgan';
import CustomError from './errors/custom-error';
import { ErrorResponse } from './utils/response-handler';
import mainRoutes from './routes';

console.log(`Environment: ${process.env.NODE_ENV}`);

app.use(express.json(), morgan('dev'), cors());

app.use('/api', mainRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// All middlewares goes above this

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError('Non-existant route', 404);
  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(ErrorResponse(err));
  }
  return res.status(500).json(ErrorResponse(err));
});

export default app;
