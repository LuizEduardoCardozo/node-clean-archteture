import request from 'supertest'

import app from '../config/app'

describe('body-parser middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    const payload = { name: 'nome' }
    await request(app)
      .post('/test_body_parser')
      .send(payload)
      .expect(payload)
  })
})
