
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  map,
  catchError,
  tap,
  shareReplay,
  throwError,
  of,
} from 'rxjs';

// Define your User interface (match your backend's data structure)
export interface User {
  _id: string;
  email: string;
  username: string;
  accessToken: string; // Add accessToken property
  // ... other user properties
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3030/users/'; // Update with your backend API URL
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable().pipe(shareReplay(1)); // ShareReplay caches the last emitted value
  isLoggedIn$ = this.user$.pipe(map((user) => !!user)); // Observable to track login status

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    //Use User type instead of any
    return this.http.post<User>(`${this.apiUrl}register`, user).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(
          () => new Error(error.error?.message || 'Registration failed')
        );
      })
    );
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(
            () => new Error(error.error?.message || 'Login failed')
          );
        }),
        shareReplay(1) //Cache the response
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get<User>(`${this.apiUrl}me`, { headers }).pipe(
        map((user) => user),
        catchError((err) => {
          console.error('Error getting current user:', err);
          this.logout();
          return of(null);
        })
      );
    }
    return of(null);
  }

  //Helper function to check if logged in synchronously
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}