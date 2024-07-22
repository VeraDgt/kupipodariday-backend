import { Injectable } from '@nestjs/common';
import { hash, genSaltSync, compare } from 'bcrypt';
import configuration from 'src/config/configuration';

@Injectable()
export class HashService {
  async hashValue(password: string): Promise<string> {
    const salt = genSaltSync(configuration().hash.saltRounds)
    return await hash(password, salt);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  // async getNewUser<T extends { password?: string }>(
  //   createUserDto: T,
  // ): Promise<Omit<T, 'password'> & { password: string }> {
  //   const { password, ...data } = createUserDto;
  //   const hashValue = await this.hashValue(password);
  //   return {
  //     ...data,
  //     password: hashValue,
  //   };
  // }
}
