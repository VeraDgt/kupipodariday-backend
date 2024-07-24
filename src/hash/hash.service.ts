import { Injectable } from '@nestjs/common';
import { hash, genSaltSync, compare } from 'bcrypt';
import configuration from 'src/config/configuration';

@Injectable()
export class HashService {
  async hashValue(password: string): Promise<string> {
    const salt = genSaltSync(configuration().hash.saltRounds)
    return await hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
