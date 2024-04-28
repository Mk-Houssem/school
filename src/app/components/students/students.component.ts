import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/users.service';



@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  tel: any;
  bulletins: any = [];
  constructor(private activateRoute: ActivatedRoute, private userService: UserService ) { }

  ngOnInit() {
    this.tel = this.activateRoute.snapshot.paramMap.get("tel");
    this.userService.getStudentByTel(this.tel).subscribe((response) => {
      console.log("Here response from BE", response);
      this.bulletins = response.bulletins;
    });
  }

}
