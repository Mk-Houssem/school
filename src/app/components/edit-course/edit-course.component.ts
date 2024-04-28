import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseForm: FormGroup;
  id: any;
  foundCourse: any;
  updateCourse: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private courseService: CourseService) { }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    this.courseService.displayCourseById(this.id).subscribe((response) => {
      this.foundCourse = response.course;
      this.initializeForm();
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.courseForm.get(controlName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  editCourse() {
    this.updateCourse = this.courseForm.value;
    this.updateCourse._id = this.id;

    this.courseService.editCourse(this.updateCourse).subscribe((response) => {
      console.log("Here response from BE", response.isUpdated);
      this.router.navigate(["dashboardTeacher"]);
    });
  }

  private initializeForm() {
    this.courseForm = this.formBuilder.group({
      name: [this.foundCourse.name, [Validators.required]],
      description: [this.foundCourse.description, [Validators.required]],
      duration: [this.foundCourse.duration, [Validators.required]],
    });
  }
}


