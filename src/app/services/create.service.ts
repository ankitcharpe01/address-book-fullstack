import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CreateService {
  
  private apiUrl = 'http://localhost:2025/addressbook/contacts';
  constructor(private http: HttpClient) {}

  submitForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
