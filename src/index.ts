import express from 'express';
import { userRouter } from './routes/user';
import { journeyRouter } from './routes/journey';

const app = express();
const port = 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/v1/user", userRouter);
app.use("/v1/journey", journeyRouter);


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});