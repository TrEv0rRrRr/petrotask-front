import {HttpInterceptorFn} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
/**
 * Interceptor for adding the authentication token to the request headers.
 * @summary
 * This interceptor adds the authentication token to the request headers if it exists in local storage.
 * If the token does not exist, the request is sent as is.
 * @param request The request object.
 * @param next The next function.
 */
export const authenticationInterceptor: HttpInterceptorFn = (
  request,
  next) => {

  // Get the token from local storage.
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('token');
  const router = inject(Router);
  
  // If the token exists, add it to the request headers. Otherwise, send the request as is.
  const handledRequest = token
    ? request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)})
    : request;
  
  console.log('Request intercepted:', handledRequest.url, token);
  
  // Return the handled request with error handling
  return next(handledRequest).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.log('Unauthorized request, redirecting to login');
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};