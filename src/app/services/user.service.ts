import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  friends: User[];
  constructor(private angularFireDatabase: AngularFireDatabase) { }

  getUsers() {
    return this.angularFireDatabase.list('/users');
  }

  getUserByUid(uid) {
    return this.angularFireDatabase.object('/users/' + uid);
  }

  createUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  editUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).update(user);
  }

  setAvatar(avatar, uid) {
    return this.angularFireDatabase.object('/users/' + uid + '/avatar').set(avatar);
  }

  addFriend(userUid, friendUid) {
    this.angularFireDatabase.object('users/' + userUid + '/friends/' + friendUid).set(friendUid);
    return this.angularFireDatabase.object('users/' + friendUid + '/friends/' + userUid).set(userUid);
  }
}
