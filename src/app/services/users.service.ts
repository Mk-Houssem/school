import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userURL: string = "http://localhost:3000/api/users"

  constructor(private http: HttpClient) { }

  // user={email,pwd}
  login(user) {
    return this.http.post<{ token: string, msg: any }>(this.userURL + "/login", user);
  }
  signup(userObj, file: File) {
    let formData = new FormData();
    //comment remplir le formData
    formData.append("firstName", userObj.firstName);
    formData.append("lastName", userObj.lastName);
    formData.append("email", userObj.email);
    formData.append("pwd", userObj.pwd);
    formData.append("role", userObj.role);
    formData.append("speciality", userObj.speciality);
    formData.append("address", userObj.address);
    formData.append("telChild", userObj.telChild);
    formData.append("tel", userObj.tel);
    formData.append("status", userObj.status);
    formData.append("file", file);


    return this.http.post<{ msg: boolean }>(this.userURL + "/signup", formData);
  }
  displayAlUsers() {
    return this.http.get<{ users: any }>(this.userURL);
  }
  displayAllTeachers() {
    return this.http.get<{ teachers: any }>(`${this.userURL}/teachers/`);
  }
  displayAllStudent() {
    return this.http.get<{ students: any }>(`${this.userURL}/students/`);
  }

  editProfile(newUser) {
    return this.http.put<{ isUpdated: boolean }>(this.userURL, newUser);
  }
  displayProfile(id) {
    return this.http.get<{ user: any }>(`${this.userURL}/profile/${id}`);
  }

  updateStatus(userObj) {
    return this.http.put<{ isUpdated: boolean }>(`${this.userURL}/status/`, userObj);
  }
  getStudentByTel(tel){
    return this.http.get<{bulletins:any}>(`${this.userURL}/student/${tel}`);
  }
  deleteUser(id){
    return this.http.delete<{ msg: any }>(`${this.userURL}/${id}`)
  }

}

