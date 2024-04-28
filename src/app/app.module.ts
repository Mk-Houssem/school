import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AboutComponent } from './components/about/about.component';
import { CategoryComponent } from './components/category/category.component';
import { CoursesComponent } from './components/courses/courses.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TeamComponent } from './components/team/team.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { BlogComponent } from './components/blog/blog.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student.component';
import { DashboardTeacherComponent } from './components/dashboard-teacher/dashboard-teacher.component';
import { TableCoursesComponent } from './components/table-courses/table-courses.component';
import { TableUsersComponent } from './components/table-users/table-users.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { TableGroupComponent } from './components/table-group/table-group.component';
import { BulletinTableComponent } from './components/bulletin-table/bulletin-table.component';
import { TableStudentComponent } from './components/table-student/table-student.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { SearchTeacherComponent } from './components/search-teacher/search-teacher.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentsComponent } from './components/students/students.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CarouselComponent,
    AboutComponent,
    CategoryComponent,
    CoursesComponent,
    RegistrationComponent,
    TeamComponent,
    TestimonialComponent,
    BlogComponent,
    FooterComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    AddCourseComponent,
    DashboardAdminComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent,
    TableCoursesComponent,
    TableUsersComponent,
    AddGroupComponent,
    TableGroupComponent,
    BulletinTableComponent,
    TableStudentComponent,
    EditCourseComponent,
    SearchTeacherComponent,
    TeacherComponent,
    StudentsComponent,
    EditProfileComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
