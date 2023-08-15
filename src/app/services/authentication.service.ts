import { Injectable } from '@angular/core';
import { Auth, UserInfo, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Observable, concatMap, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) { }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));

  }

  logout() {
    return from(this.auth.signOut());
  }

  signup(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)
    )
  }
  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap(user => {

        if (!user) throw new Error("Not Authenticated");
        return updateProfile(user, profileData);
      })
    )
  }

}

