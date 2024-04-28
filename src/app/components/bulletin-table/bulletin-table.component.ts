import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { BulletinService } from 'src/app/services/bulletin.service';

@Component({
  selector: 'app-bulletin-table',
  templateUrl: './bulletin-table.component.html',
  styleUrls: ['./bulletin-table.component.css']
})
export class BulletinTableComponent implements OnInit {


  id_teacher: any;
  groupsTeacherTab: any = [];
  students: any = [];
  bulletins: any = [];
  filePreview: any;
  bulletin: any = {};
  bulletinStudent: any = {};
  groupId: any;
  studentId: any;
  note: any;
  evaluation: any;
  constructor(private groupService: GroupService, private bulletinService: BulletinService) { }

  ngOnInit() {
    this.loadGroups();
    this.loadBulletins();
  }
  loadGroups() {
    this.id_teacher = (this.decodeToken(sessionStorage.getItem("token"))).id;
    this.groupService.getTeacherGroups(this.id_teacher).subscribe((response) => {
      console.log("Here response from BE", response);
      this.groupsTeacherTab = response.groups;
    });
  }
  loadBulletins() {
    this.bulletinService.getAllBulletins().subscribe((response) => {
      console.log("Here response from BE", response);
      this.bulletins = response.bulletins;
    });
  }
  evaluateStudent(idGroup, idStudent) {

    const bulletin = this.bulletins.find(b => b.groupId === idGroup && b.studentId === idStudent);

    Swal.fire({
      title: 'Ajouter une évaluation et une note',
      html:
        '<input id="evaluation" class="swal2-input" placeholder="Évaluation">' +
        '<input id="note" type="number" class="swal2-input" placeholder="Note">',
      showCancelButton: true,
      confirmButtonText: 'Valider',

      preConfirm: () => {
        const evaluation = (<HTMLInputElement>document.getElementById('evaluation')).value;
        const note = (<HTMLInputElement>document.getElementById('note')).value;
        return { evaluation, note };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { evaluation, note } = result.value;

        if (bulletin) {
          // Mettre à jour le bulletin existant
          bulletin.evaluation = evaluation;
          bulletin.note = note;
          console.log("Here bulletin", bulletin);

          this.bulletinService.updateBulletin(bulletin).subscribe((response) => {
            console.log('Réponse du backend', response);

          });
        } else {
          // Créer un nouveau bulletin
          const newBulletin = {
            groupId: idGroup,
            studentId: idStudent,
            evaluation: evaluation,
            note: note
          };

          this.bulletinService.addBulletin(newBulletin).subscribe((response) => {
            console.log('Réponse du backend', response);
            this.ngOnInit();
          });


        }

      //   this.loadBulletins();
      //   this.loadGroups();
      }

    });
  }
  displayStudent(idGroup, idStudent) {
    this.bulletinStudent = {
      idGroup: idGroup,
      idStudent: idStudent
    };
    console.log(this.bulletinStudent);

    this.bulletinService.getStudentBulletin(this.bulletinStudent).subscribe((response) => {
      console.log('Réponse du backend', response);

      // Vérifiez que "bulletins" est un tableau et prenez le premier élément s'il existe
      const studentTab = Array.isArray(response.bulletins) && response.bulletins.length > 0
        ? response.bulletins[0]
        : null;

      if (studentTab) {
        Swal.fire({
          title: 'l\'évaluation et la note',
          html:
            `<div> Evaluation : ${studentTab.evaluation}</div>` +
            `<div> Note : ${studentTab.note}</div>`,
        });
      } else {
        // Gérez le cas où les données ne sont pas disponibles ou mal structurées
        console.error('Données incorrectes ou non disponibles dans la réponse du backend');
        this.loadBulletins();
      }
    });
  }
  decodeToken(token: string): any {
    return jwt_decode(token);
  }
}

