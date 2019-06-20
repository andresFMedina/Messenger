import { AuthenticationService } from './../services/authentication.service';
import { ConversationService } from './../services/conversation.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversationId: string;
  textMessage: string;
  conversation: any[];
  shake: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private conversationService: ConversationService, private authenticationService: AuthenticationService) {
    this.friendId = this.activatedRoute.snapshot.params["uid"];
    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserByUid(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        this.userService.getUserByUid(this.friendId).valueChanges().subscribe(
          (data2: User) => {
            this.friend = data2;
            const ids = [this.user.uid, this.friend.uid].sort();
            this.conversationId = ids.join('|');
            this.getConversation();
          }, (error) => {
            console.log(error);
          });
      }, (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });

  }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  sendShake() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'shake'
    };
    this.conversationService.createConversation(message).then(() => { });
    this.doShake();
  }

  doShake() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }

  getConversation() {
    this.conversationService.getConversation(this.conversationId).valueChanges().subscribe((data) => {
      this.conversation = data;
      this.conversation.forEach((message) => {
        if (!message.seen && message.receiver == this.user.uid) {
          message.seen = true;
          this.conversationService.updateConversation(message);
          if (message.type === 'text') {
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          } else if (message.type === 'shake') {
            this.doShake()
          }
        }
      })
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  getUserNickByUid(uid) {
    if (uid === this.friend.uid) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }

}
