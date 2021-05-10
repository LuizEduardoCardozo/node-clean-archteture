import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, nxt: NextFunction): void => {
  res.type('json')
  nxt()
}
