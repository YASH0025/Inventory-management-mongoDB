import express, { json } from 'express';
const app = express();
import db from './database/db.js';
import mongoose from 'mongoose';
import allRoutes from './index.js';

app.use(json());
app.use('/', allRoutes);

const PORT = 5500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
