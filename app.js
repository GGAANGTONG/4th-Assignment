import express from 'express';
import connect from './schemas/index.js';
import productsRouter from './routes/products.router.js';

const app = express();
const PORT = 8500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect();

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: '국밥은 위대하다.' });
});

app.use('/api', [router, productsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '가 연결됐습니다.');
});
