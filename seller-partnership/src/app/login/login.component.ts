import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  userData: Object = { name: '', pwd: '' };

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  onLogin() {
    let _obj = { name: this.userData['name'], pwd: this.userData['pwd'] };
    this.userService.userName = this.userData['name'];
    this.getData(_obj).subscribe((res) => {
      if (res && res['status']) {
        this.router.navigate(['/whiteboard']);
      }
    });
  }

  getData(_obj) {
    return this.http.post('/checklogin', _obj, this.httpOptions);
  }
}
