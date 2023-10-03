import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Green Hive server !');
});

app.get('/posts', async (req, res) => {});

app.post('/posts', async (req, res) => {});

app.get('/posts/:id', async (req, res) => {});

app.patch('/posts/:id', async (req, res) => {});

app.delete('/posts/:id', async (req, res) => {});

app.listen(process.env.PORT, () => {
  console.log(`====================================================`);
  console.log(`App listening on port ${process.env.PORT}`);
  console.log(`====================================================`);
});
