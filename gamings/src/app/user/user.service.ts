import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface LoginResponse {
  token?: string; // Check your backend's actual response structure!
  message?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3030/users/login'; // **Crucially, replace with your actual backend API URL**

  constructor(private http: HttpClient) {}

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<LoginResponse>(this.apiUrl, credentials, { headers })
      .pipe(
        map((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token); //Store the token in local storage
            return response; //return the response object including token,user object and so on...
          } else {
            throw new Error('Authentication Failed!'); //throw an error that can be handled appropriately
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          if (error.error && error.error.message) {
            //This will depend on the error handling of your back end. Handle any specific error messages.
            return throwError(() => new Error(error.error.message)); //Re-throw an appropriate error from backend
          }
          return throwError(() => new Error('An error occurred during login.')); //Default error to let the front end know something happened.
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
