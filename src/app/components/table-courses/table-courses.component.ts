import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-table-courses',
  templateUrl: './table-courses.component.html',
  styleUrls: ['./table-courses.component.css']
})
export class TableCoursesComponent implements OnInit {

id_teacher:any;
  coursesTab:any = [];
  constructor(private router:Router, private courseService: CourseService) { }

  ngOnInit() {
    this.loadCourse();

  }
  loadCourse(){
    this.id_teacher = (this.decodeToken(sessionStorage.getItem("token"))).id;
    console.log(this.id_teacher);
    
    this.courseService.displayCoursesTeacher(this.id_teacher).subscribe(
      (response)=>{
        console.log("Here response from BE", response);
      this.coursesTab = response.courses;
      });
  }
    
  goToEdit(id){
    this.router.navigate([`editCourse/${id}`]);
  }


  deleteCourse(id){
    this.courseService.deleteCourse(id).subscribe((response)=>{
      console.log("Here response from BE", response);
      this.loadCourse();
    })
    
  }

  decodeToken(token: string):any {
    return jwt_decode(token);
    }
}
