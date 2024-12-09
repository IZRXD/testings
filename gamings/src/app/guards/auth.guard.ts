import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserService } from '../user/user.service';
import { map, take, catchError, of } from 'rxjs';
import { User } from '../models/user';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getCurrentUser().pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error in AuthGuard:', error);
      // Handle the error appropriately (e.g., redirect to an error page)
      router.navigate(['/error']); //Example
      return of(false);
    })
  );
};
