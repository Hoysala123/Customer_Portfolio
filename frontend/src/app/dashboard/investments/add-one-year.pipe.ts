import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addOneYear' })
export class AddOneYearPipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = new Date(value);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }
}
