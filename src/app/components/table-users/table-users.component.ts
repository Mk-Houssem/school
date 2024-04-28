import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css']
})
export class TableUsersComponent implements OnInit {
  usersTab: any = [];
  roleTab: any = [];
  x: string = '';
  foundTeacher:any;
  acceptTeacher:any={};
  @Input() usersInput:any;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.displayAlUsers().subscribe(
      (response) => {
        console.log("Here response from BE", response);
        this.usersTab = response.users;
      });
  }

  // // Fonction pour trier le tableau par colonne
  // sortTable(column: string) {
  //   this.usersTab.sort((a, b) => (a[column] > b[column]) ? 1 : -1);
  // }

  filterTableByRole(selectedRole: string) {
    this.x = selectedRole;
    this.roleTab = this.usersTab.filter(user => user.role === this.x);
  }

  confirmTeacher(id) { 
    this.foundTeacher = this.usersTab.find(user => user._id === id);
    console.log(this.foundTeacher);
    
    this.acceptTeacher.id=this.foundTeacher._id;
    this.acceptTeacher.status="confirmé";
    console.log(this.acceptTeacher);
    
    this.userService.updateStatus(this.acceptTeacher).subscribe((response)=>{
    console.log("Here response from BE",response.isUpdated);
   
    this.userService.displayAlUsers().subscribe(
      (response) => {
        console.log("Here response from BE", response);
        this.usersTab = response.users;
        this.roleTab = this.usersTab.filter(user => user.role === this.x);
      });

    });
  }

  displayCV(id) {
  
    // Vérifier si le tableau roleTab n'est pas vide
    if (this.roleTab.length > 0) {
      // Vérifier si l'ID correspond à celui que vous recherchez dans roleTab
      const userWithId = this.roleTab.find(user => user._id === id);
      
      if (userWithId) {
        // Utiliser un modèle de chaîne de caractères pour créer la source du PDF
        const pdfSource = userWithId.file;
  
        // Afficher le PDF dans une fenêtre modale
        Swal.fire({
          html: `<embed src="${pdfSource}" type="application/pdf" width="400" height="300">`,
        });
      } else {
        // Si aucun utilisateur avec l'ID spécifié n'a été trouvé, afficher un message d'erreur
        Swal.fire({
          text: "Aucun CV correspondant à l'ID spécifié n'a été trouvé.",
          icon: "error",
        });
      }
    } else {
      // Si aucun utilisateur avec le rôle spécifié n'a été trouvé, afficher un message d'erreur
      Swal.fire({
        text: "Aucun utilisateur avec le rôle spécifié n'a été trouvé.",
        icon: "error",
      });
    }
  }
  deleteUser(id){
    this.userService.deleteUser(id).subscribe((response)=>{
      console.log("Here response from BE",response);
      this.userService.displayAlUsers().subscribe(
        (response) => {
          console.log("Here response from BE", response);
          this.usersTab = response.users;
        });
    })
  
  }
  
  



}
