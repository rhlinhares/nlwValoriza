import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      error: 'Cannot find token',
    });
  }
  const [, token] = authToken.split(' ');

  try {
    const { sub } = verify(token, '3ca37e4b6eb8c1e5295ee0c0043ff8a9') as IPayload;

    request.user_id = sub;

    return next();
  } catch (err) {
    return response.status(401).json({
      error: 'Invalid token',
    });
  }
}
