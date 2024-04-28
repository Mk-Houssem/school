import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  title: string;
  path: string;
  filePreview: any;
  pdfPreview: any;
  pdfData: any;
  imagePreview: any;
  file: any;
  document: any;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private usersService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.path = this.router.url;
    if (this.path == "/signupTeacher") {
      this.title = "Teacher";
    } else if (this.path == "/signupStudent") {
      this.title = "Student";
    } else if (this.path == "/signupParent") {
      this.title = "Parent";
    } else { this.title = "Admin"; }


    this.signupForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(5)]],
      email: ["", [Validators.required, Validators.email]],
      pwd: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      speciality: ["", [Validators.required, Validators.minLength(5)]],
      address: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      telChild: ["", [Validators.required, Validators.pattern('[0-9]{8}')]],
      tel: ["", [Validators.required, Validators.pattern('[0-9]{8}')]],
      file: [""],

    })
  }
  signup() {


    if (this.path == "/signupTeacher") {
      this.signupForm.value.role = "teacher";
      this.signupForm.value.status = "en Attente";
    } else if (this.path == "/signupStudent") {
      this.signupForm.value.role = "student";
    } else if (this.path == "/signupParent") { this.signupForm.value.role = "parent"; }
    else if (this.path == "/signupAdmin") { this.signupForm.value.role = "admin"; }

    console.log("here user", this.signupForm.value);

    this.usersService.signup(this.signupForm.value, this.signupForm.value.file).subscribe((response) => {
      console.log("Here response from BE", response);
      this.router.navigate(["login"])
    })
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);

    this.signupForm.patchValue({ img: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    if (this.file && this.file.type === 'application/pdf') {
      this.readFileAsDataURL(this.file);
    } else {
      // Gérer les erreurs si le fichier n'est pas un PDF
      console.error('Veuillez sélectionner un fichier PDF valide.');
    }
  }

  private readFileAsDataURL(file: File): void {
    this.signupForm.patchValue({ file: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const pdfDataUrl = event.target.result;
      this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
    };
    reader.readAsDataURL(file);
    this.document = file.name;
    console.log(this.document);

  }




}
