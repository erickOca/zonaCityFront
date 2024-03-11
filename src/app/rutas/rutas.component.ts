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
    { id: 10, name: 'CENTRO', destinations: ['PPG', 'Center'], startTime: '08:00 AM',finTime: '09:00 AM' },
    { id: 34, name: 'ZOCALO', destinations: ['Zocalo', 'Catalina Pastrana'], startTime: '09:30 AM',finTime: '10:00 AM'  },
    { id: 45, name: 'PPG', destinations: ['PPG', 'Catalina Pastrana'], startTime: '10:15 AM' },
    { id: 53, name: 'ZOCALO', destinations: ['Zocalo', 'Center'], startTime: '11:45 AM' },
    { id: 5, name: 'CENTRO', destinations: ['PPG', 'Zocalo', 'Center'], startTime: '01:00 PM' }
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