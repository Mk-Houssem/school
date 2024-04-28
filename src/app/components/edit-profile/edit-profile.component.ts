import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editUserForm: FormGroup;
  id: any;
  role:any;
  findedUser: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,) { }

  ngOnInit() {

    this.editUserForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(5)]],
      email: ["", [Validators.required, Validators.email]],
      speciality: ["", [Validators.required, Validators.minLength(5)]],
      address: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      telChild: ["", [Validators.required, Validators.pattern('[0-9]{8}')]],
      tel: ["", [Validators.required, Validators.pattern('[0-9]{8}')]],
    
    })

    this.id = (this.decodeToken(sessionStorage.getItem("token"))).id;
    this.role = (this.decodeToken(sessionStorage.getItem("token"))).role;
    this.userService.displayProfile(this.id).subscribe((data)=>{
      console.log("here user from BE", data.user);
      this.findedUser = data.user;  
    })
  }

  decodeToken(token: string) : any {
    return jwt_decode(token);
  }

  editProfile(){
    let obj=this.editUserForm.value;
    obj._id= (this.decodeToken(sessionStorage.getItem("token"))).id;
    this.userService.editProfile(obj).subscribe((response)=>{
      console.log("here res from BE", response.isUpdated); 
    })
    this.router.navigate([""])
  }

}
