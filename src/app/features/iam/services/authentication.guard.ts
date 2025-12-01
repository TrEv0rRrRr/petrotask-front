import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

/**
 * Guard to protect routes that require authentication.
 * Checks if user is signed in and has valid token.
 */
export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.isSignedIn.pipe(
    take(1),
    map((isSignedIn) => {
      // Check if user is signed in and has a token
      const token = localStorage.getItem('token');

      if (isSignedIn && token) {
        // Check if route requires specific roles
        const requiredRoles = route.data['roles'] as string[];

        if (requiredRoles && requiredRoles.length > 0) {
          // Get current user roles
          let hasRequiredRole = false;
          authService.currentRoles.pipe(take(1)).subscribe((userRoles) => {
            hasRequiredRole = requiredRoles.some((role) =>
              userRoles.map((r) => r.toString()).includes(role)
            );
          });

          if (!hasRequiredRole) {
            router.navigate(['/petrotask/home']);
            return false;
          }
        }

        return true;
      }

      // Redirect to login if not authenticated
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );
};
