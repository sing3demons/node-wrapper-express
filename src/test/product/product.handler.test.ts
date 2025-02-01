import supertest from 'supertest'
import app from '../../server'
import ProductService from '@/product/product.service'

describe('Product Handler', () => {
  it('should return 200 when get product', async () => {
    const sp = jest
      .spyOn(ProductService.prototype, 'getProducts')
      .mockResolvedValue([{ id: '1', name: 'product 1', price: 1000, description: 'description 1' }])

    const response = await supertest(app).get('/products')
    expect(response.status).toBe(200)

    sp.mockRestore()
  })

    it('should return 201 when create product', async () => {
        const sp = jest
        .spyOn(ProductService.prototype, 'createProduct')
        .mockResolvedValue({ id: '1', name: 'product 1', price: 1000, description: 'description 1' })
    
        const response = await supertest(app).post('/products').send({ name: 'product 1', price: 1000, description: 'description 1' })
        expect(response.status).toBe(201)
    
        sp.mockRestore()
    })

    it('should return 200 when get product by id', async () => {
        const sp = jest
        .spyOn(ProductService.prototype, 'getProductById')
        .mockResolvedValue({ id: '1', name: 'product 1', price: 1000, description: 'description 1' })
    
        const response = await supertest(app).get('/products/1')
        expect(response.status).toBe(200)
    
        sp.mockRestore()
    })

    // return 404 when product not found
    it('should return 404 when product not found', async () => {
        const sp = jest
        .spyOn(ProductService.prototype, 'getProductById')
        .mockResolvedValue(null)
    
        const response = await supertest(app).get('/products/1')
        expect(response.status).toBe(404)
    
        sp.mockRestore()
    })
})
