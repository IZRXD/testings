import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private UserService: any, //needs fix
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Invalid form! Please fill all fields.';
      this.loginForm.markAllAsTouched(); //Mark fields as touched to display errors
      return;
    }
    this.loading = true;
    this.UserSevice
      .login(this.loginForm.value)
      .pipe(
        catchError((err) => {
          this.error = err.message;
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/home']);
          }
          this.loading = false;
        },
        error: (err) => (this.loading = false),
      });
  }
}
