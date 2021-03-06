import request from 'supertest'

import app from '../config/app'

describe('cors middleware', () => {
  test('should enable cors', async () => {
    app.get('/cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
