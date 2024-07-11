import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrayectoService {

  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }

  getAllStops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}stops`);
  }

  // Otros métodos para CRUD, como agregar, actualizar o eliminar paradas
}