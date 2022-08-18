// Backend Node structure: https://github.com/geshan/expressjs-structure/tree/a46e4526f47b8b2de5b12761f738f37946a9fe1b
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;

const userRouter = require('./src/routes/users.route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({'message': 'Server is ok'});
});

app.use('/api/users', userRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
