// Backend Node structure: https://github.com/geshan/expressjs-structure/tree/a46e4526f47b8b2de5b12761f738f37946a9fe1b
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;

const authRouter = require('./src/routes/auth.route');
const userRouter = require('./src/routes/users.route');
const packinglistRouter = require('./src/routes/packinglist.route');
const packingitemRouter = require('./src/routes/packingitem.route');
const gpxGeoJsonRouter = require('./src/routes/gpxGeoJson.route');

const verifyToken = require('./src/middlewares/auth');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/packinglist', verifyToken, packinglistRouter);
app.use('/api/packinglist', verifyToken, packingitemRouter);
app.use('/api/gpx', gpxGeoJsonRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`${statusCode} - ${err.message}\n`, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.get('/', (req, res) => {
  res.json({ message: 'Server is ok' });
});

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
