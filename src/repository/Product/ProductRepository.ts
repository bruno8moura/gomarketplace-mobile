import { Product } from '../../services/Product/AddProductToCartService';

interface ProductRepository {
  update(products: string): Promise<boolean>;
  index(): Promise<string>;
}

export default ProductRepository;
