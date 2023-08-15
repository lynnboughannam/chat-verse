import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string, duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top') {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition,
      verticalPosition,
    });
  }

  showLoading(message: string,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top') {
    this.snackBar.open(message, 'Close', {
      horizontalPosition,
      verticalPosition,
    });
  }

  showError(message: string, duration: number = 5000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top') {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition,
      verticalPosition,
    });
  }
}
