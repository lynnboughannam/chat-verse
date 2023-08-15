import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { UserProfile } from 'src/app/models/user-profile';
import { FormControl, FormGroup } from '@angular/forms';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { concatMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  //user$ = this.authService.currentUser$
  user$ = this.usersService.currentUserProfile$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    //photoURL: new FormControl(''),


  })


  constructor(private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private snackbarService: SnackbarService,
    private usersService: UsersService,
    // private transformToUserProfile: transformToUserProfile
  ) {

  }
  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
      })
  }
  uploadImage(event: any, user: UserProfile) {

    this.snackbarService.showLoading('Image uploading...');

    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        // concatMap((photoURL) => this.authService.updateProfileData({ photoURL })) // Update the parentheses here
        concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL })) // Update the parentheses here
        //to update the image in the nav 
      )
      .subscribe(
        () => {
          this.snackbarService.showSuccess('Image uploaded!!', 3000);
        },
        (error) => {
          this.snackbarService.showError('Error uploading!', 5000);
          console.error('Upload error:', error);
        }
      );
  }

  saveProfile() {

    const profileData = this.profileForm.value;

    const userProfile = this.usersService.transformToUserProfile(profileData);


    this.usersService.updateUser(userProfile).
      subscribe(
        () => {
          this.snackbarService.showSuccess('Saved!!', 3000);
        },
        (error) => {
          this.snackbarService.showError('Error Saving!', 5000);
          console.error('Saving error:', error);
        }
      );
  }
}
