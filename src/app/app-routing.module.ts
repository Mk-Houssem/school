import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';
import { DashboardTeacherComponent } from './components/dashboard-teacher/dashboard-teacher.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { SearchTeacherComponent } from './components/search-teacher/search-teacher.component';
import { StudentsComponent } from './components/students/students.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';


const routes: Routes = [
  {path:"",component: HomeComponent},
  {path:"signupAdmin",component: SignupComponent},
  {path:"signupTeacher",component: SignupComponent},
  {path:"signupStudent",component: SignupComponent},
  {path:"signupParent",component: SignupComponent},
  {path:"signupAdmin",component: SignupComponent},
  {path:"login",component: LoginComponent},
  {path:"dashboardAdmin",component: DashboardAdminComponent},
  {path:"dashboardStudent",component: DashboardStudentComponent},
  {path:"dashboardTeacher",component: DashboardTeacherComponent},
  {path:"addCourse",component: AddCourseComponent},
  {path:"addGroup",component: AddGroupComponent},
  {path:"editCourse/:id",component: EditCourseComponent},
  {path:"searchTeacher",component: SearchTeacherComponent},
  {path:"searchTel/:tel",component: StudentsComponent},
  {path:"editProfile",component: EditProfileComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
