import express from 'express';
import cors from 'cors'; 
import mainRouter from './api/routes/index.js';
import { startPremiereCheckJob } from './jobs/emailScheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173' // Apenas permite requisições desta origem
};

app.use(cors(corsOptions)); 

app.use(express.json());
app.use('/api', mainRouter);

startPremiereCheckJob();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
