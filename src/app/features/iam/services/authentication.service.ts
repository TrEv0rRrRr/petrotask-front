import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { List } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { environment } from '../../../../environments/environment';
import { Roles } from '../models/roles.enum';
import { SignInRequest } from '../models/sign-in.request';
import { SignInResponse } from '../models/sign-in.response';
import { SignUpRequest } from '../models/sign-up.request';
import { SignUpResponse } from '../models/sign-up.response';

/**
 * Service for handling authentication operations.
 * @summary
 * This service is responsible for handling authentication operations like sign-up, sign-in, and sign-out.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  router = inject(Router);
  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);

  basePath: string = `${environment.apiBaseUrl}`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private signedInUsername: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private roles: BehaviorSubject<Roles[]> = new BehaviorSubject<Roles[]>([]);

  constructor() {
    if (this.localStorageService.hasKey('userSession')) {
      const userSession: SignInResponse =
        this.localStorageService.getItem('userSession');
      this.signedIn.next(true);
      this.signedInUserId.next(userSession.id);
      this.signedInUsername.next(userSession.username);
      this.roles.next(userSession.roles as Roles[]);
    }
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUsername() {
    return this.signedInUsername.asObservable();
  }

  get currentRoles() {
    return this.roles.asObservable();
  }

  /**
   * Sign up a new user.
   * @summary
   * This method sends a POST request to the server with the user's registration data.
   * @param signUpRequest The {@link SignUpRequest} object containing the user's registration data.
   * @returns Observable of {@link SignUpResponse} object containing the user's id and username.
   */
  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(
      `${this.basePath}/authentication/sign-up`,
      signUpRequest,
      this.httpOptions
    );
  }

  /**
   * Sign in a user.
   * @summary
   * This method sends a POST request to the server with the user's username and password.
   * @param signInRequest The {@link SignInRequest} object containing the user's username and password.
   * @returns Observable of {@link SignInResponse} object containing the user's id, username, and token.
   */
  signIn(signInRequest: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(
      `${this.basePath}/authentication/sign-in`,
      signInRequest,
      this.httpOptions
    );
  }

  /**
   * Handle successful sign in.
   * @summary
   * Updates the authentication state and stores the token.
   * @param response The sign in response.
   */
  handleSuccessfulSignIn(response: SignInResponse): void {
    this.signedIn.next(true);
    this.signedInUserId.next(response.id);
    this.signedInUsername.next(response.username);
    this.roles.next(response.roles as Roles[]);
    this.localStorageService.setItem('token', response.token);
    this.localStorageService.setItem('userSession', response);
    this.localStorageService.removeItem('menuItems');
    this.router.navigate(['/petrotask/home']).then();
  }

  /**
   * Handle successful sign up.
   * @summary
   * Navigates to the sign-in page after successful registration.
   * @param response The sign up response.
   */
  handleSuccessfulSignUp(response: SignUpResponse): void {
    this.router.navigate(['/login']).then();
  }

  /**
   * Handle authentication error.
   * @summary
   * Resets the authentication state and navigates to the appropriate page.
   * @param error The error object.
   * @param redirectTo The page to redirect to (default: '/login').
   */
  handleAuthError(error: any, redirectTo: string = '/login'): void {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    console.error(`Authentication error: ${error}`);
    this.router.navigate([redirectTo]).then();
  }

  /**
   * Sign out the user.
   * @summary
   * This method sets the signedIn, signedInUserId, and signedInUsername to their default values,
   * removes the token from the local storage, and navigates to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then();
  }
}
