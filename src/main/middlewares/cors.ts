import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, nxt: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  nxt()
}
