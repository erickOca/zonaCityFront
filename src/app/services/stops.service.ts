import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
private _refresh$ = new Subject<void>();
  private datos = [
    {
      "id": 0,
      "trayecto": "ppg - centro",
      "latitud": 18.37076592,
      "longitud": -99.53281508
    },
    {
      "id": 1,
      "trayecto": "ppg - centro",
      "latitud": 18.37076592,
      "longitud": -99.53281508
    },
    {
      "id": 2,
      "trayecto": "ppg - centro",
      "latitud": 18.36917224,
      "longitud": -99.53345467
    },
    {
      "id": 3,
      "trayecto": "ppg - centro",
      "latitud": 18.36794928,
      "longitud": -99.53401686
    },
    {
      "id": 4,
      "trayecto": "ppg - centro",
      "latitud": 18.36727019,
      "longitud": -99.53467472
    },
    {
      "id": 5,
      "trayecto": "ppg - centro",
      "latitud": 18.36334236,
      "longitud": -99.53844008
    },
    {
      "id": 6,
      "trayecto": "ppg - centro",
      "latitud": 18.36256455,
      "longitud": -99.53923846
    },
    {
      "id": 7,
      "trayecto": "ppg - centro",
      "latitud": 18.35965896,
      "longitud": -99.54198108
    },
    {
      "id": 8,
      "trayecto": "ppg - centro",
      "latitud": 18.35908601,
      "longitud": -99.54033849
    },
    {
      "id": 9,
      "trayecto": "ppg - centro",
      "latitud": 18.35802377,
      "longitud": -99.53764537
    },
    {
      "id": 10,
      "trayecto": "ppg - centro",
      "latitud": 18.35461178,
      "longitud": -99.53865522
    },
    {
      "id": 11,
      "trayecto": "ppg - centro",
      "latitud": 18.35342045,
      "longitud": -99.539101
    },
    {
      "id": 12,
      "trayecto": "ppg - centro",
      "latitud": 18.35102303,
      "longitud": -99.53979726
    },
    {
      "id": 13,
      "trayecto": "ppg - centro",
      "latitud": 18.3491884,
      "longitud": -99.53997788
    },
    {
      "id": 14,
      "trayecto": "ppg - centro",
      "latitud": 18.34571531,
      "longitud": -99.54090527
    },
    {
      "id": 15,
      "trayecto": "Ppg centro - mercado",
      "latitud": 18.34481667,
      "longitud": -99.54111603
    },
    {
      "id": 16,
      "trayecto": "Ppg centro - mercado",
      "latitud": 18.34416746,
      "longitud": -99.54134443
    },
    {
      "id": 17,
      "trayecto": "Ppg centro - mercado",
      "latitud": 18.34344961,
      "longitud": -99.54148366
    },
    {
      "id": 18,
      "trayecto": "Ppg centro - mercado",
      "latitud": 18.34035056,
      "longitud": -99.54234144
    },
    {
      "id": 19,
      "trayecto": "base mercado",
      "latitud": 18.33708257,
      "longitud": -99.54240445
    },
    {
      "id": 20,
      "trayecto": "mercado  -Ppg centro",
      "latitud": 18.33784685,
      "longitud": -99.54204255
    },
    {
      "id": 21,
      "trayecto": "mercado  -Ppg centro",
      "latitud": 18.33950544,
      "longitud": -99.54148582
    },
    {
      "id": 22,
      "trayecto": "mercado  -Ppg centro",
      "latitud": 18.34172785,
      "longitud": -99.54078766
    },
    {
      "id": 23,
      "trayecto": "mercado  -Ppg centro",
      "latitud": 18.34321585,
      "longitud": -99.54045784
    },
    {
      "id": 24,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.34345838,
      "longitud": -99.54151037
    },
    {
      "id": 25,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.34506705,
      "longitud": -99.54390592
    },
    {
      "id": 26,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.34829965,
      "longitud": -99.5423735
    },
    {
      "id": 27,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.35102303,
      "longitud": -99.53979726
    },
    {
      "id": 28,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.35342045,
      "longitud": -99.539101
    },
    {
      "id": 29,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.35461178,
      "longitud": -99.53865522
    },
    {
      "id": 30,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.35802377,
      "longitud": -99.53764537
    },
    {
      "id": 31,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.35965896,
      "longitud": -99.54198108
    },
    {
      "id": 32,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36256455,
      "longitud": -99.53923846
    },
    {
      "id": 33,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36334236,
      "longitud": -99.53844008
    },
    {
      "id": 34,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36727019,
      "longitud": -99.53467472
    },
    {
      "id": 35,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36794928,
      "longitud": -99.53401686
    },
    {
      "id": 36,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36917224,
      "longitud": -99.53345467
    },
    {
      "id": 37,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.3700379,
      "longitud": -99.53314767
    },
    {
      "id": 38,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.36955882,
      "longitud": -99.53222568
    },
    {
      "id": 39,
      "trayecto": "Ppg centro- ppg base",
      "latitud": 18.370503,
      "longitud": -99.53195337
    }
  ];
  constructor(private http: HttpClient) { }

  getRefresh(){
    return this._refresh$;  
  }
  getStops(): Observable<any[]> {
    return of(this.datos);
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
