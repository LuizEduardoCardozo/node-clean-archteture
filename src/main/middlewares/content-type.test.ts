import request from 'supertest'

import app from '../config/app'

describe('content-type middleware', () => {
  test('should return default content type as application/json', async () => {
    app.get('/content-type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/content-type')
      .expect('content-type', /json/)
  })

  test('should return default xml content type when forced', async () => {
    app.get('/content-type-xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/content-type-xml')
      .expect('content-type', /xml/)
  })
})
