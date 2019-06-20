import { UserService } from './../services/user.service';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;
  constructor(private autheticationSercive: AuthenticationService, private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.autheticationSercive.loginWithEmail(this.email, this.password).then(
      (data) => {
        alert('Logeado');
        console.log(data);
        this.router.navigate(['home']);
      }).catch(
        (error) => {
          alert('Ocurrió un error :(');
          console.log(error);
        });
  }

  register() {
    this.autheticationSercive.registerWithEmail(this.email, this.password).then(
      (data) => {
        const user = {
          uid: data.user.uid,
          email: data.user.email,
          nick: this.nick,
          status: 'online'
        };
        this.userService.createUser(user).then(
          (data2) => {
            alert('Registrado');
            console.log(data);
          }).catch(
            (error) => {
              alert('Ocurrió un error :(');
              console.log(error);
            });

      }).catch(
        (error) => {
          alert('Ocurrió un error :(');
          console.log(error);
        });
  }

}
