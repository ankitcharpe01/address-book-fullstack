import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../home/home.component';
import { NgModel } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private http: HttpClient) {}


  deleteData(person: Address) {
    const payload = {
      id: person.id
    };
    
    this.http.delete('http://localhost:2025/contacts'+person.id, {
      body: payload
    }).subscribe({
      next: (data) => {
        console.log('Data deleted:', data);
      },
      error: (err) => {
        console.error('Error deleting data:', err);
      }
    });
  }
}
