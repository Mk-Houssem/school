import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
 //courseURL adresse du serveur BE
 courseURL:string = "http://localhost:3000/api/course";
 // httpClient : Bostagi
  constructor(private httpClient: HttpClient) { }

  // Array of courses objects
  displayAllCourses(){
    return this.httpClient.get<{ courses: any }>(this.courseURL);
    }

    displayCoursesTeacher(id){
      return this.httpClient.get<{ courses: any }>(`${this.courseURL}/teacher/${id}`);
      }

    // Objet
    displayCourseById(id){
    return this.httpClient.get<{course: any}>(`${this.courseURL}/${id}`);
    }


  // boolean, string
    deleteCourse(id){
    return this.httpClient.delete<{msg: any}>(`${this.courseURL}/${id}`);
    }


    // boolean, string
    addCourse(courseObj){
    return this.httpClient.post<{msg: any}>(this.courseURL, courseObj);
    }

    
    // boolean, string
    editCourse(newCourse){ 
    return this.httpClient.put<{isUpdated: boolean}>(this.courseURL, newCourse);
    }
    

}