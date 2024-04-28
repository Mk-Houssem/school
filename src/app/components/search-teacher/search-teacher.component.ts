import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/users.service';


@Component({
  selector: 'app-search-teacher',
  templateUrl: './search-teacher.component.html',
  styleUrls: ['./search-teacher.component.css']
})

export class SearchTeacherComponent implements OnInit {
searchTeachers : any=[];
teachersTab : any=[];
searchForm: FormGroup;
teacher:any={};
  constructor(private userService:UserService) { }

  ngOnInit() {
    this.userService.displayAllTeachers().subscribe(
      (response)=>{
        console.log("Here response from BE", response);
      this.teachersTab = response.teachers;
      console.log("Here teachersTab", this.teachersTab);
      });
  }


  searchTeacher() {
    this.searchTeachers = [];
    let obj = this.teacher;
   
    this.searchTeachers = this.teachersTab.filter((elt)=>{
      return (
        elt.speciality == obj.speciality
      );
    });
  }
  updateTeachers(T:any){
    this.teachersTab=T;
  }


}