import { CanActivateFn } from '@angular/router';

export const testGuard: CanActivateFn = () => {
  console.log('TEST GUARD EXECUTED - This proves guards are working');
  return false; // Always block
};
