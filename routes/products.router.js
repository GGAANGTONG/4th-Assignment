import express from 'express';
import Product from '../schemas/products.schema.js';

const router = express.Router();

//상품 작성 API
router.post('/productList', async (req, res) => {
  const { title, content, author, password } = req.body;
  let date = '';
  let status = '';

  date = date !== undefined ? new Date() : null;
  status = status !== undefined ? 'FOR_SALE' : null;

  const insertedProductMaxOrder = await Product.findOne()
    .sort({ date: -1 })
    .exec();
  const insertedProductOrder = insertedProductMaxOrder
    ? insertedProductMaxOrder.order + 1
    : 1;

  const productList = new Product({
    title,
    content,
    author,
    date,
    status,
    password,
    order: insertedProductOrder,
  });

  await productList.save();

  return res.status(201).json({ productList: productList });
});

//상품 목록 조회 API(상품명, 작성자명, 상품 상태, 날짜)
router.get('/productList', async (req, res) => {
  const products = await Product.find().sort({ date: -1 }).exec();
  const formattedProducts = products.map((product) => {
    return {
      _id: product._id,
      title: product.title,
      author: product.author,
      status: product.status,
      date: product.date,
      password: product.password,
    };
  });

  return res.status(200).json({
    products: formattedProducts,
  });
});

//상품 상세 조회 API(상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜)
router.get('/productList/:productId', async (req, res) => {
  const { productId } = req.params;
  const detailedProduct = await Product.findOne({ _id: productId }).exec();

  return res.status(200).json({
    title: detailedProduct.title,
    content: detailedProduct.content,
    author: detailedProduct.author,
    status: detailedProduct.status,
    date: detailedProduct.date,
  });
});

//상품 정보 수정 API(상품명, 작성 내용, 상품 상태, 비밀번호)
router.patch('/productList/:productId', async (req, res) => {
  const { productId } = req.params;
  const { title, content, password } = req.body;

  const currentProductList = await Product.findOne({ _id: productId }).exec();
  if (!currentProductList) {
    return res
      .status(404)
      .json({ errorMessage: '해당 상품은 존재하지 않습니다.' });
  }

  if (
    title === currentProductList.title &&
    password === currentProductList.password &&
    content !== undefined
  ) {
    currentProductList.content = content;
  }
  await currentProductList.save();

  return res.status(200).json({
    title: currentProductList.title,
    content: currentProductList.content,
    author: currentProductList.author,
    date: currentProductList.date,
    status: currentProductList.status,
    password: currentProductList.password,
    order: currentProductList.order,
  });
});

//상품 삭제 API(비밀번호)
router.delete('/productList/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({ _id: productId }).exec();

  if (!product) {
    return res.status(404).json({ message: '존재하지 않는 제품입니다.' });
  }

  if (product.password !== req.body.password) {
    return res.status(500).json({ message: '잘못된 비밀번호입니다.' });
  } else if (product.password === req.body.password) {
    await Product.deleteOne({ _id: productId }).exec();
  }

  return res
    .status(200)
    .json({ message: '해당 제품이 성공적으로 삭제되었습니다.' });
});

export default router;
