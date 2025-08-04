import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import uploadCodes from './routes/admin/uploadCodes.js';
import claimRoute from './routes/user/claim.js';
import adminGetCodes from './routes/admin/get-codes.js';
import markUsedRoute from './routes/user/mark-used.js';
import { initDB } from './db.js'; 


const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());



initDB().then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/admin/upload-codes', uploadCodes);
  app.use('/api/claim', claimRoute);
  app.use('/api/admin/get-codes', adminGetCodes);
  app.use('/api/mark-used', markUsedRoute);


  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB:', err);
});
