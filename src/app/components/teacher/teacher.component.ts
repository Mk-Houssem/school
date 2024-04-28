import { Component, OnInit,Input,Output,EventEmitter  } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachersTab : any=[];
  user: string;
  @Input() teacherInput:any;
  @Output() teacherOutput:EventEmitter<any>=new EventEmitter();
  constructor(private userService:UserService) { }


  ngOnInit() {
    this.userService.displayAllTeachers().subscribe(
      (response)=>{
        console.log("Here response from BE", response);
      this.teachersTab = response.teachers;
      console.log("Here teachersTab", this.teachersTab);
      })
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

  deleteTeacher(id){
    this.userService.deleteUser(id).subscribe((response)=>{
      console.log("Here response from BE",response);
    })
  }

}
