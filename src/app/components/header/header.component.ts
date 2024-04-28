import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  tel: string
  user: string;
  constructor(private router: Router) { }

  ngOnInit() {



  }
  isLoggedIn() {
    const jwt = sessionStorage.getItem('token');
    if (jwt) {
      this.user = this.decodeToken(jwt)
    }
    return !!jwt;
  }
  decodeToken(token: string): any {
    return jwt_decode(token);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(["login"]);
  }

  search() {
    console.log(this.tel);
    this.router.navigate([`searchTel/${this.tel}`]);
  }
  

}
