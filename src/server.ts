import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Bienvenue sur mon serveur Express !');
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur mon serveur Express !');
});

app.listen(process.env.PORT, () => {
  console.log(`====================================================`);
  console.log(`App listening on port ${process.env.PORT}`);
  console.log(`====================================================`);
});
