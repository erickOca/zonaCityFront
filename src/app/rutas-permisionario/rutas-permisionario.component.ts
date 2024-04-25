import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas-permisionario',
  templateUrl: './rutas-permisionario.component.html',
  styleUrls: ['./rutas-permisionario.component.css']
})
export class RutasPermisionarioComponent implements OnInit {
  constructor() { }
  originalTableData: any[] = [
    { id: 10, name: '1/4',timellegada:'5 minutos', destinations: ['PPG', 'Center'], startTime: '08:00 AM',finTime: '09:00 AM',numPasajeros: '10/14',velocidad:'70 km/h' },
    { id: 34, name: '3/4',timellegada:'20 minutos', destinations: ['Zocalo', 'Catalina Pastrana'], startTime: '09:30 AM',finTime: '10:00 AM' ,numPasajeros: '10/14',velocidad:'80 km/h' }
    // { id: 45, name: 'PPG',timellegada:'30 minutos', destinations: ['PPG', 'Catalina Pastrana'], startTime: '10:15 AM' ,numPasajeros: '10/14',velocidad:'70 km/h'},
    // { id: 53, name: 'ZOCALO',timellegada:'1 hora', destinations: ['Zocalo', 'Center'], startTime: '11:45 AM' ,numPasajeros: '8/14',velocidad:'30 km/h'},
    // { id: 5, name: 'CENTRO',timellegada:'2 horas', destinations: ['PPG', 'Zocalo', 'Center'], startTime: '01:00 PM',numPasajeros: '5/14',velocidad:'20 km/h' }
  ];

  tableData: any[] = [];
    
  ngOnInit(): void {
    // Al inicio, se mostrarán todas las rutas
    this.tableData = this.originalTableData;
  }

  filterData(locations: string[]) {
    this.tableData = this.originalTableData.filter(item => {
      return locations.every(location => item.destinations.includes(location));
    })
    Swal.fire({
      title: 'Espera un momento',
      text: 'Cargando las unidades disponibles...',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}