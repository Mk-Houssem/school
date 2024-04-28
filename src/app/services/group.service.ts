import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  //courseURL adresse du serveur BE
  groupURL: string = "http://localhost:3000/api/group";
  // httpClient : Bostagi
  constructor(private httpClient: HttpClient) { }

  // boolean, string
  addGroup(groupObj) {
    return this.httpClient.post<{ message: any }>(this.groupURL, groupObj);
  }

  getAllGroups() {
    return this.httpClient.get<{ groups: any }>(this.groupURL)
  }

  getTeacherGroups(id) {
    return this.httpClient.get<{ groups: any }>(`${this.groupURL}/${id}`)
  }

  deleteGroup(id){
    return this.httpClient.delete<{ message: any }>(`${this.groupURL}/${id}`)
  }
}


