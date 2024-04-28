import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { BulletinService } from 'src/app/services/bulletin.service';

@Component({
  selector: 'app-table-group',
  templateUrl: './table-group.component.html',
  styleUrls: ['./table-group.component.css']
})
export class TableGroupComponent implements OnInit {
  
  groupsTab: any = [];
  bulletins: any = [];
  bulletinStudent: any = {};
  constructor(private groupService: GroupService , private bulletinService: BulletinService) { }

  ngOnInit() {
    this.loadGroups();
    this.loadBulletins();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe((response) => {
      console.log("Here response from BE", response);
      this.groupsTab = response.groups;
    });
  }

  loadBulletins() {
    this.bulletinService.getAllBulletins().subscribe((response) => {
      console.log("Here response from BE", response);
      this.bulletins = response.bulletins;
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
      }
    });
  }

  deleteGroup(id){
    this.groupService.deleteGroup(id).subscribe((response)=>{
      console.log("Here response from BE", response);
      this.loadGroups();
    })
  }

  decodeToken(token: string): any {
    return jwt_decode(token);
  }
}
