import ProductRepositoryAsyncStorage from './ProductRepositoryAsyncStorage';

import ProductRepository from './ProductRepository';

export default ((): ProductRepository => new ProductRepositoryAsyncStorage())();
