import { Component, OnInit  } from '@angular/core';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  
 
  teachersTab : any=[];
    constructor(private userService:UserService) { }

  
  ngOnInit() {
    this.userService.displayAllTeachers().subscribe(
      (response)=>{
        console.log("Here response from BE", response);
      this.teachersTab = response.teachers;
      console.log("Here teachersTab", this.teachersTab);
      });
  }

  updateTeachers(T:any){
    this.teachersTab=T;
  }
}
