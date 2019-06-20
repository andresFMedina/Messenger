import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  createRequest(request) {
    const cleanEmail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/' + cleanEmail + '/' + request.sender).set(request);
  }

  setRequestStatus(request, status) {
    const cleanEmail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/' + cleanEmail + '/' + request.sender + '/status').set(status);
  }

  getRequestsForEmai(email){
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('requests/' + cleanEmail);
  }
}
