import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Stops2Service {

  private datos = [
    {
      "id": 0,
      "trayecto": "Mercado - Palacio",
      "latitud":17.563468585294096, 
      "longitud": -99.50666142804948
    },
    {
      "id": 1,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.562134416072613,
      "longitud": -99.50588705665668
    },
    {
      "id": 2,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.562376993023975, 
      "longitud": -99.50544455873704
    },
    {
      "id": 3,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.56178637030645, 
      "longitud": -99.50481399916697
    },
    {
      "id": 4,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.56253519519844,
      "longitud":  -99.50345884922909
    },
    {
      "id": 5,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.561121917440573, 
      "longitud": -99.50295550778445
    },
    {
      "id": 6,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.56236,
      "longitud": -99.49916
    },
    {
      "id": 7,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.56043,
      "longitud": -99.49787
    },
    {
      "id": 8,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.55868,
      "longitud": -99.4963
    },
    {
      "id": 9,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.55757,
      "longitud": -99.49287
    },
    {
      "id": 10,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.55567,
      "longitud": -99.49235
    },
    {
      "id": 11,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.55362,
      "longitud": -99.49062
    },
    {
      "id": 12,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.55078,
      "longitud": -99.48768
    },
    {
      "id": 13,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54972,
      "longitud": -99.48825
    },
    {
      "id": 14,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54772,
      "longitud": -99.4884
    },
    {
      "id": 15,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54659,
      "longitud": -99.48787
    },
    {
      "id": 16,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54503,
      "longitud": -99.48576
    },
    {
      "id": 17,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54347,
      "longitud": -99.48441
    },
    {
      "id": 18,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54251,
      "longitud": -99.48392
    },
    {
      "id": 19,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54089,
      "longitud": -99.48367
    },
    {
      "id": 20,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.54006,
      "longitud": -99.48357
    },
    {
      "id": 21,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53888,
      "longitud": -99.48314
    },
    {
      "id": 22,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53715,
      "longitud": -99.4871
    },
    {
      "id": 23,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.5353,
      "longitud": -99.4884
    },
    {
      "id": 24,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53431,
      "longitud": -99.4895
    },
    {
      "id": 25,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53484,
      "longitud": -99.49067
    },
    {
      "id": 26,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53421,
      "longitud": -99.49183
    },
    {
      "id": 27,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53325,
      "longitud": -99.49345
    },
    {
      "id": 28,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53215,
      "longitud": -99.49489
    },
    {
      "id": 29,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.53075,
      "longitud": -99.49645
    },
    {
      "id": 30,
      "trayecto": "Mercado - Palacio",
      "latitud": 17.52832,
      "longitud": -99.4942
    },
    {
      "id": "Base Aurrera",
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.53274,
      "longitud": -99.49381
    },
    {
      "id": 31,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.5341,
      "longitud": -99.49185
    },
    {
      "id": 32,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.53407,
      "longitud": -99.49009
    },
    {
      "id": 33,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.53611,
      "longitud": -99.48791
    },
    {
      "id": 34,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.53886,
      "longitud": -99.48297
    },
    {
      "id": 35,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54005,
      "longitud": -99.48348
    },
    {
      "id": 36,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54086,
      "longitud": -99.48359
    },
    {
      "id": 37,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54279,
      "longitud": -99.48393
    },
    {
      "id": 38,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54372,
      "longitud": -99.48437
    },
    {
      "id": 39,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54507,
      "longitud": -99.4852
    },
    {
      "id": 40,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54612,
      "longitud": -99.4877
    },
    {
      "id": 41,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54651,
      "longitud": -99.48777
    },
    {
      "id": 42,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54928,
      "longitud": -99.48807
    },
    {
      "id": 43,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.54974,
      "longitud": -99.48817
    },
    {
      "id": 44,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.55076,
      "longitud": -99.48754
    },
    {
      "id": 45,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.55354,
      "longitud": -99.4905
    },
    {
      "id": 46,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.55549,
      "longitud": -99.49203
    },
    {
      "id": 47,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.55759,
      "longitud": -99.49284
    },
    {
      "id": 48,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.55862,
      "longitud": -99.49616
    },
    {
      "id": 49,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.56239,
      "longitud": -99.49884
    },
    {
      "id": 50,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.56135532543353,
      "longitud":  -99.50289054842432
    },
    {
      "id": 51,
      "trayecto": "Aurrera - Mercado",
      "latitud": 17.562707644432265, 
      "longitud":-99.50359976382894
    }
  ]
  
  constructor(private http: HttpClient) { }
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