import { mock } from 'jest-mock-extended'
import { IProductRepository } from '../../product/product.repository'
import ProductService from '../../product/product.service'

describe('ProductService', () => {
  const productRepository = mock<IProductRepository>()

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createProduct', () => {
    it('should return product', async () => {
      // Arrange
      const body = {
        name: 'product 1',
        price: 100,
        description: 'description 1',
      }
      const product = {
        id: '1',
        href: 'http://localhost:3000/products/1',
        ...body,
      }
      productRepository.create.mockResolvedValueOnce(product)

      // Act
      const productService = new ProductService(productRepository)
      const result = await productService.createProduct(body)

      // Assert
      expect(result).toEqual(product)
      expect(productRepository.create).toHaveBeenCalledWith(body)
    })
  })

  describe('getProducts', () => {
    it('should return products', async () => {
      // Arrange
      const products = [
        {
          id: '1',
          name: 'product 1',
          price: 100,
          description: 'description 1',
        },
      ]
      productRepository.getProducts.mockResolvedValueOnce(products)

      // Act
      const productService = new ProductService(productRepository)
      const result = await productService.getProducts()

      // Assert
      expect(result).toEqual(products)
      expect(productRepository.getProducts).toHaveBeenCalled()
    })
  })

  describe('getProductById', () => {
    it('should return product', async () => {
      // Arrange
      const product = {
        id: '1',
        name: 'product 1',
        price: 100,
        description: 'description 1',
      }
      productRepository.getProductById.mockResolvedValueOnce(product)

      // Act
      const productService = new ProductService(productRepository)
      const result = await productService.getProductById('1')

      // Assert
      expect(result).toEqual(product)
      expect(productRepository.getProductById).toHaveBeenCalledWith('1')
    })
  })
})
