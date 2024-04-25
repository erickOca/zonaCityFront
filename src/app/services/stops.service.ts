import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
private _refresh$ = new Subject<void>();
  constructor(private http: HttpClient) { }

  getRefresh(){
    return this._refresh$;  
  }
  getStops(): Observable<any[]> {
    return this.http.get<any[]>('assets/datos.json').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return of([]); // Devuelve un array vacío en caso de error
  }
  imprimirTrayectos(): void {
    this.getStops().subscribe(data => {
      data.forEach(parada => {
        console.log('Trayecto:', parada.trayecto);
      });
    });
  }


}
