import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { BulletinService } from 'src/app/services/bulletin.service';

@Component({
  selector: 'app-table-student',
  templateUrl: './table-student.component.html',
  styleUrls: ['./table-student.component.css']
})
export class TableStudentComponent implements OnInit {
  id_student: any;
  bulletinsStudentTab: any = [];
  bulletinStudent: any = {};

  constructor(private bulletinService: BulletinService) { }

  ngOnInit() {

    this.id_student = (this.decodeToken(sessionStorage.getItem("token"))).id;
    this.bulletinService.displayStudentCourseById(this.id_student).subscribe((response) => {
      console.log("Here response from BE", response);
      this.bulletinsStudentTab = response.bulletins;
      console.log(this.bulletinsStudentTab);
      
    });
  }

  displayStudent(id) {

    this.bulletinService.getStudentBulletinId(id).subscribe((response) => {
      console.log('Réponse du backend', response);
      this.bulletinStudent=response.bulletins
      if (this.bulletinStudent) {
        Swal.fire({
          title: 'l\'évaluation et la note',
          html:
            `<div> Evaluation : ${this.bulletinStudent.evaluation}</div>` +
            `<div> Note : ${this.bulletinStudent.note}</div>`,
        });
      } else {
        // Gérez le cas où les données ne sont pas disponibles ou mal structurées
        console.error('Données incorrectes ou non disponibles dans la réponse du backend');
      }
    });
  }

  decodeToken(token: string): any {
    return jwt_decode(token);
  }

}
