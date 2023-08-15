import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest, concatMap, map, of, startWith, switchMap, tap } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  @ViewChild('endOfChat')
  endOfChat!: ElementRef;

  searchControl = new FormControl('');
  // Add | string[] to the type of chatListControl
  chatListControl = new FormControl<string | string[] | null>(null);

  messageControl = new FormControl('');

  user$ = this.usersServices.currentUserProfile$;
  // users$ = this.usersServices.allUsers$;


  users$ = combineLatest([
    this.usersServices.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ])
    .pipe(
      map(([users, user, searchString]) =>
        searchString
          ? users.filter(u => {
            const displayName = u.displayName?.toLowerCase();
            const searchStr = searchString.toLowerCase();
            return u.displayName?.toLowerCase().includes(searchStr) && u.uid !== user?.uid;
          })
          : users.filter(u => u.uid !== user?.uid)
      )
    );

  myChats$ = this.chatService.myChats$;

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(
    map(([value, chats]) => {
      if (value && value.length > 0) {
        return chats.find((c) => c.id === value[0]);
      }
      return null;
    })
  );

  messages$ = this.chatListControl.valueChanges.pipe(
    map(value => value?.[0] || ''),
    switchMap(chatId => this.chatService.getChatMessages$(chatId)),
    tap(() => {
      this.scrollToBottom();
    })
  )
  firestore: any;


  constructor(
    private authService: AuthenticationService,
    private usersServices: UsersService,
    private chatService: ChatsService
  ) {

  }
  ngOnInit(): void {
  }

  createChat(otherUser: UserProfile) {
    this.chatService.isExistingChat(otherUser?.uid).pipe(
      switchMap(chatId => {
        if (chatId) {
          return of(chatId);
        } else {
          return this.chatService.createChat(otherUser);
        }
      })
    ).subscribe(chatId => {
      this.chatListControl.setValue([chatId]); // Set the value as an array with chatId
    });
  }



  addChatMessage(chatId: string, message: string): Observable<any> {

    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date())
    return this.usersServices.currentUserProfile$.pipe(
      concatMap((user) => addDoc(ref, {
        text: message,
        senderId: user?.uid,
        sentDate: today
      })),
      concatMap(() => updateDoc(chatRef, { lastMesssage: message, lastMessageDate: today }))
    )
  }

  sendMessage() {
    const message = this.messageControl.value;

    const selectedChatId = this.chatListControl.value?.[0];
    if (message && selectedChatId) {
      //addmessage
      this.chatService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {
          this.scrollToBottom();
        })
      this.messageControl.setValue('');
    }
  }




  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
