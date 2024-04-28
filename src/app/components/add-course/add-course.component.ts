import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  // Form objet
  courseForm: FormGroup;
  id_teacher: string;
 
  constructor(private formBuilder: FormBuilder, private router: Router, private courseService: CourseService) { }

  ngOnInit() {

    this.id_teacher = (this.decodeToken(sessionStorage.getItem("token"))).id;
    
    this.courseForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      duration: ["", [Validators.required]],
    });
    console.log("Here courseForm", this.courseForm);
  }

  addCourse() {
    this.courseForm.value.id_teacher = this.id_teacher;
    console.log("Here courseForm", this.courseForm.value);
    this.courseService.addCourse(this.courseForm.value).subscribe((response) => {
      console.log("Here response from BE", response.msg);
      this.router.navigate(["dashboardTeacher"]);
    });
  }

  decodeToken(token: string):any {
    return jwt_decode(token);
    }

}