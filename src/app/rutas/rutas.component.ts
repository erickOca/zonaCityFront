import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})

export class RutasComponent implements OnInit {
  constructor() { }
  originalTableData: any[] = [
    { id: 10, name: 'CENTRO',timellegada:'5 minutos', destinations: ['PPG', 'Center'], startTime: '08:00 AM',finTime: '09:00 AM',numPasajeros: '10/14' },
    { id: 34, name: 'ZOCALO',timellegada:'20 minutos', destinations: ['Zocalo', 'Catalina Pastrana'], startTime: '09:30 AM',finTime: '10:00 AM' ,numPasajeros: '10/14' },
    { id: 45, name: 'PPG',timellegada:'30 minutos', destinations: ['PPG', 'Catalina Pastrana'], startTime: '10:15 AM' ,numPasajeros: '10/14'},
    { id: 53, name: 'ZOCALO',timellegada:'1 hora', destinations: ['Zocalo', 'Center'], startTime: '11:45 AM' ,numPasajeros: '8/14'},
    { id: 5, name: 'CENTRO',timellegada:'2 horas', destinations: ['PPG', 'Zocalo', 'Center'], startTime: '01:00 PM',numPasajeros: '5/14' }
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