/* eslint-disable class-methods-use-this */
import AsyncStorage from '@react-native-community/async-storage';
import ProductRepository from './ProductRepository';

class ProductRepositoryAsyncStorage implements ProductRepository {
  private key = '@GoMarketplaceCart:products';

  async index(): Promise<string> {
    const item = await AsyncStorage.getItem(this.key);
    return item || '';
  }

  async update(products: string): Promise<boolean> {
    await AsyncStorage.setItem(this.key, products);

    // await AsyncStorage.clear();
    return Promise.resolve(true);
  }
}

export default ProductRepositoryAsyncStorage;
