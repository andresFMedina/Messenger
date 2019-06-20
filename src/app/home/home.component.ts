import { RequestsService } from './../services/requests.service';
import { AuthenticationService } from './../services/authentication.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: User[];
  user: User;
  query: string;
  friendEmail = '';
  constructor(private userService: UserService, private authenticationService: AuthenticationService,
    private router: Router, private modalService: NgbModal, private requestsService: RequestsService) {
    this.userService.getUsers().valueChanges().subscribe(
      (data: User[]) => {
        this.friends = data;
        console.log(data);
      }, (error) => {
        console.log(error);
      }
    );
    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserByUid(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        if(this.user.friends){
          this.user.friends = Object.values(this.user.friends);
        }
        console.log(this.user);
      }, (error) => {
        console.log(error);
      })
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
  logOut() {
    this.authenticationService.logOut().then(
      () => {
        alert('Sesión Cerrada');
        this.router.navigate(['login']);
      }).catch(() => {
        alert('No se pudo');
      });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {

    });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    }
    this.requestsService.createRequest(request).then(() => {
      alert('Solicitud Enviada');
    }).catch((error) => {
      alert('No se pudo');
      console.log(error);
    });
  }

}
