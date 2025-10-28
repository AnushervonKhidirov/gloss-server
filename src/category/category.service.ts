import { Injectable } from '@nestjs/common';
import { ReturnWithErr } from 'src/common/type/return-with-err.type';

@Injectable()
export class CategoryService {
  findOne(id: number): ReturnWithErr<{ id: number; text: string }> {
    console.log(id);
    return [{ id: 1, text: 'mtf' }, null];
  }

  findMany(): ReturnWithErr<{ id: number; text: string }[]> {
    return [
      [
        { id: 1, text: 'mtf' },
        { id: 2, text: 'mtf2' },
      ],
      null,
    ];
  }
}
