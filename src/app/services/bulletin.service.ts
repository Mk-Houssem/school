import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  bulletinUrl: string = "http://localhost:3000/api/bulletin";
  constructor(private httpClient: HttpClient) { }

  addBulletin(Obj) {
    return this.httpClient.post<{ message: any }>(this.bulletinUrl, Obj);
  }

  getStudentBulletin(Obj) {
    return this.httpClient.post<{ bulletins: any }>(`${this.bulletinUrl}/student`, Obj)
  }
  getAllBulletins() {
    return this.httpClient.get<{ bulletins: any }>(this.bulletinUrl)
  }
  updateBulletin(Obj) {
    return this.httpClient.put<{ isUpdated: boolean }>(`${this.bulletinUrl}/note`, Obj);
  }

  displayStudentCourseById(id) {
    return this.httpClient.get<{ bulletins: any }>(`${this.bulletinUrl}/${id}`);
  }

  getStudentBulletinId(id) {
    return this.httpClient.get<{ bulletins: any }>(`${this.bulletinUrl}/note/${id}`)
  }

}
