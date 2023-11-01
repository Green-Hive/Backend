import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`============================`);
  console.log(`App listening on port ${process.env.PORT}||`);
  console.log(`====================================================`);
});
