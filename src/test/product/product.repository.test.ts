import { Collection, MongoClient, ObjectId } from 'mongodb'
import ProductRepository, { IProductRepository } from '../../product/product.repository'
// import { mock } from 'jest-mock-extended'

describe('ProductRepository', () => {
  let mockCollection: jest.Mocked<Collection>
  let productRepository: IProductRepository

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Collection>

    productRepository = new ProductRepository(mockCollection)
  })

  describe('create', () => {
    it('should return product', async () => {
      // Arrange
      const body = {
        name: 'product 1',
        price: 100,
        description: 'description 1',
      }
      const insertedId = new ObjectId()

      // Use spyOn to mock insertOne on mockCollection
      const insertOneSpy = jest
        .spyOn(mockCollection, 'insertOne')
        .mockResolvedValueOnce({ acknowledged: true, insertedId })

      //   mockCollection.insertOne = jest.fn().mockResolvedValueOnce({ acknowledged: true, insertedId })

      // Act
      const result = await productRepository.create(body)

      // Assert
      expect(result).toEqual({
        id: insertedId.toHexString(),
        href: `http://localhost:3000/products/${insertedId.toHexString()}`,
        name: body.name,
        price: body.price,
        description: body.description,
      })

      //   expect(mockCollection.insertOne).toHaveBeenCalledWith(body)
      expect(insertOneSpy).toHaveBeenCalledWith(body)
    })
  })

  describe('getProducts', () => {
    it('should return products', async () => {
      // Arrange
      const products = [
        {
          _id: new ObjectId(),
          name: 'product 1',
          price: 100,
          description: 'description 1',
        },
        {
          _id: new ObjectId(),
          name: 'product 2',
          price: 200,
          description: 'description 2',
        },
      ]

      mockCollection.find = jest.fn().mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValueOnce(products),
      })

      // Act
      const result = await productRepository.getProducts()

      // Assert
      expect(result).toEqual(
        products.map((product) => {
          return {
            id: product._id.toHexString(),
            href: `http://localhost:3000/products/${product._id.toHexString()}`,
            name: product.name,
            price: product.price,
            description: product.description,
          }
        })
      )

      expect(mockCollection.find).toHaveBeenCalled()
    })
  })

  describe('getProductById', () => {
    it('should return product', async () => {
      const _id = new ObjectId()
      const product = {
        _id: _id,
        name: 'product 1',
        href: `http://localhost:3000/products/${_id.toHexString()}`,
        price: 100,
        description: 'description 1',
      }
      const id = '67962e06705d207a9c259848'
      mockCollection.findOne = jest.fn().mockResolvedValueOnce(product)

      const result = await productRepository.getProductById(id)

      expect(result).toEqual({
        id: product._id.toHexString(),
        href: `http://localhost:3000/products/${product._id.toHexString()}`,
        name: product.name,
        price: product.price,
        description: product.description,
      })
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString(id) })
    })
  })
})
