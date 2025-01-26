import { initMongo } from './db'
import app from './server'

async function main() {
  await initMongo()

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

main()
