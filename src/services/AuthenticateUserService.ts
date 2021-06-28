import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from '../repositories/UserRepositories';

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({ email });

    if (!user) {
      throw new Error('email/password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('email/password incorrect');
    }

    const token = sign(
      {
        email: user.email,
      },
      '3ca37e4b6eb8c1e5295ee0c0043ff8a9',
      { subject: user.id, expiresIn: '2d' }
    );

    return token;
  }
}

export { AuthenticateUserService };
