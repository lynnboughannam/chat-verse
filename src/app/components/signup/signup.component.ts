import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsersService } from 'src/app/services/users.service';


export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),


  }, { validators: passwordsMatchValidator() });
  //crossfield validators

  constructor(private authService: AuthenticationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private usersService: UsersService) { }


  ngOnInit(): void {
  }

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  submit() {
    const { name, email, password } = this.signupForm.value;

    if (!this.signupForm.valid || !email || !password || !name) {
      return;
    }

    this.snackbarService.showLoading('Signing up ...');

    this.authService.signup(email, password).pipe(
      switchMap(({ user: { uid } }) => this.usersService.addUser({ uid, email, displayName: name }))
    ).subscribe(
      () => {
        // Signup success
        this.snackbarService.showSuccess('Signup successful!', 3000);
        this.router.navigate(['/home']); // Navigate to the home page
      },
      (error) => {
        // Signup failed
        this.snackbarService.showError('Signup failed. Please try again.', 5000);
        console.error('Signup error:', error);
      }
    );
  }


}

