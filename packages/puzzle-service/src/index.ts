import express from 'express';
import { puzzleRouter } from './routes/puzzleRoutes';
import { errorHandler, notFoundHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(puzzleRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`puzzle-service listening on port ${PORT}`);
});

export { app };
