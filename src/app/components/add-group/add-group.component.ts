import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  groupForm: FormGroup;
  courses: any = [];
  teachers: any = [];
  students: any = [];
  group: any = {};
  teacherId: any;
  courseId: any;
  studentId: any;
  selectedTeacherId: any;   // Variable pour stocker l'ID de l'enseignant sélectionné
  selectedCourseId: any;        // Variable pour stocker l'ID du cours sélectionné
  selectedStudentIds: any = [];   // Tableau pour stocker les ID des étudiants sélectionnés



  constructor(private userService: UserService, private courseServise: CourseService, private groupServise: GroupService, private router: Router) { }

  ngOnInit() {
    // Récupération de la liste des enseignants
    this.userService.displayAllTeachers().subscribe((response) => {
      this.teachers = response.teachers;
      console.log("here is teachers", this.teachers);
      this.teacherId = this.teachers[0]._id;
    });

    // Récupération de la liste des cours
    this.courseServise.displayAllCourses().subscribe((response) => {
      this.courses = response.courses;
      console.log("here is courses", this.courses);
      this.courseId = this.courses[0]._id;
    });

    // Récupération de la liste des étudiants
    this.userService.displayAllStudent().subscribe((response) => {
      this.students = response.students;
      console.log("here is students", this.students);
      this.studentId = this.students[0]._id;
    });
  }

  select(event, type: string) {
    const value = event.target.value;

    if (type === 'teacher') {
      this.selectedTeacherId = value;      
    } else if (type === 'course') {
      this.selectedCourseId = value;
    } else if (type === 'student') {
      if (!this.selectedStudentIds) {
        this.selectedStudentIds = [value];
      } else if (this.selectedStudentIds.includes(value)) {
        // Désélectionnez l'étudiant s'il a déjà été sélectionné
        this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== value);
      } else {
        // Sinon, ajoutez l'identifiant à la liste
        this.selectedStudentIds.push(value);
      }
    }
  }


  addGroup() {
    // Création de l'objet groupe avec les sélections
    this.group = {
      name: this.group.name,
      teacherId: this.selectedTeacherId,
      courseId: this.selectedCourseId,
      studentsIds: this.selectedStudentIds
    };

    console.log("here group object", this.group);

    // Appel du service pour ajouter le groupe
    this.groupServise.addGroup(this.group).subscribe((response) => {
      console.log("Here response from BE", response.message);
      this.router.navigate(["dashboardAdmin"]);
    });
  }
}
