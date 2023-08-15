import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])

  })

  constructor(private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void { }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  submit() {
    //desturcture out form
    const { email, password } = this.loginForm.value;

    if (!this.loginForm.valid || !email || !password) {
      return
    }



    this.snackbarService.showLoading('Logging in...');

    this.authService.login(email, password).subscribe(
      () => {
        // Login success
        this.snackbarService.showSuccess('Login successful!', 3000);
        this.router.navigate(['/home']);
      },
      (error) => {
        // Login failed
        this.snackbarService.showError('Login failed. Please try again.', 5000);
        console.error('Login error:', error);
      }
    );
  }

}
