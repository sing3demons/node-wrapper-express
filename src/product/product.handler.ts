import { IProductService } from './product.service'
import { createProductSchema } from './product.model'
import { Type } from '@sinclair/typebox'
import { HandlerSchema, statusMap } from '@node-express-kp/sing3demons'

export default class ProductHandler {
  constructor(private readonly productService: IProductService) {}

  public getProduct = HandlerSchema(async (ctx) => {
    const products = await this.productService.getProducts()
    ctx.response(statusMap.OK, products)
  })

  public createProduct = HandlerSchema(
    async (ctx) => {
      const product = await this.productService.createProduct(ctx.body)
      ctx.response(statusMap.Created, product)
    },
    {
      schema: {
        body: createProductSchema,
      },
    }
  )

  public getProductById = HandlerSchema(
    async (ctx) => {
      const product = await this.productService.getProductById(ctx.params.id)
      if (!product) {
        ctx.response(statusMap.NotFound, { message: 'Product not found' })
        return
      }
      ctx.response(statusMap.OK, product)
    },
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
      },
    }
  )
}
