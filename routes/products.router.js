import express from 'express';
import Product from '../schemas/products.schema.js';
import joi from 'joi';

const router = express.Router();

const validationTest = joi.object({
  title: joi.string().min(1).max(20).required(),
  content: joi.string().min(10).max(50).required(),
  author: joi.string().min(1).max(8),
  status: joi.string().valid('FOR_SALE', 'SOLD_OUT'),
  password: joi.string().min(4).max(4).required(),
});

//상품 작성 API
router.post('/productList', async (req, res, next) => {
  try {
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

    const validation = await validationTest.validateAsync(req.body);
    const { title, content, author, password } = validation;

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
  } catch (error) {
    next(error);
  }
});

//상품 목록 조회 API(상품명, 작성자명, 상품 상태, 날짜)
router.get('/productList', async (req, res) => {
  const products = await Product.find().sort({ date: -1 }).exec();
  const formattedProducts = products.map((product) => {
    return {
      title: product.title,
      author: product.author,
      status: product.status,
      date: product.date,
    };
  });

  return res.status(200).json({
    products: formattedProducts,
  });
});

//상품 상세 조회 API(상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜)
router.get('/productList/:productId', async (req, res) => {
  const { productId } = req.params;
  const detailedProduct = await Product.findById(productId).exec();

  return res.status(200).json({
    title: detailedProduct.title,
    content: detailedProduct.content,
    author: detailedProduct.author,
    status: detailedProduct.status,
    date: detailedProduct.date,
  });
});

//상품 정보 수정 API(상품명, 작성 내용, 상품 상태, 비밀번호)
router.patch('/productList/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { title, author, content, password, status } = req.body;

    //findOne의 반환 값은 스키마($가 나옴)고, 그래서 스키마는 쓰면 안됨.
    const currentProductList = await Product.findById({
      _id: productId,
    }).exec();
    if (!currentProductList) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }
    console.log('currentProductList:', currentProductList);

    await validationTest.validateAsync({ title, content, password, status });

    if (
      title === currentProductList.title &&
      password === currentProductList.password &&
      content !== undefined
    ) {
      currentProductList.content = content;
      currentProductList.status = status;
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
  } catch (error) {
    next(error);
  }
});

//상품 삭제 API(비밀번호)
router.delete('/productList/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({ _id: productId }).exec();

  if (!product) {
    return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
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
