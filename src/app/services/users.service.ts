import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserProfile } from '../models/user-profile';
import { Observable, from, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  transformToUserProfile(data: any): UserProfile {
    // Handle nullable properties and provide default values if needed
    return {
      uid: data.uid || '',
      email: data.email || '',
      displayName: data.displayName || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      address: data.address || '',
    };
  }

  get currentUserProfile$(): Observable<UserProfile | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<UserProfile>;

      })
    );
  }

  get allUsers$(): Observable<UserProfile[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<UserProfile[]>
  }


  constructor(private firestore: Firestore,
    private authService: AuthenticationService) { }

  addUser(user: UserProfile): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid)

    return from(setDoc(ref, user))
  }

  updateUser(user: UserProfile): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid)

    return from(updateDoc(ref, { ...user }))
  }
}
