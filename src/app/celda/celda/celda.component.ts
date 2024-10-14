import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TrayectoService } from 'src/app/services/trayecto.service';
import * as L from "leaflet";
import { MessageData } from 'src/app/models/MessageData';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-celda',
  templateUrl: './celda.component.html',
  styleUrls: ['./celda.component.css']
})
export class CeldaComponent implements OnInit, AfterViewChecked {
  public messages: MessageData[] = [];  
  private subscription: Subscription | undefined;
  private deviceMarker: L.Marker | undefined;
  private map!: L.Map;
  private messageCount: number = 0; 
  paradas: any[] = [];
  paradasVisitadas: boolean[] = []; 
  paradaMarkers: L.Marker[] = [];
  speedKmPerHour: number = 10; // Velocidad del marcador en km/h
  isMapVisible = true;
  paradasFiltradas: any[] = [];
  @ViewChild('map', { static: false }) mapElement: ElementRef | undefined;

  constructor(
    private trayectoService: TrayectoService,
    private webSocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) { }
  ngAfterViewChecked(): void {
    if (this.isMapVisible && !this.map && this.mapElement) {
      
      this.mostrarMapa();
    }
  }
  ngOnInit(): void {
    this.showLocationAlert();
    this.trayectoService.getAllStops().subscribe(data => {
      this.paradas = data;
      this.mostrarParadas('ppg - centro');
    });

    this.webSocketService.connect().subscribe(
      (message: string) => {
        this.processWebSocketMessage(message);
      },
      (error) => {
        console.error("Error en la suscripción WebSocket:", error);
      } 
    );
  }
  mostrarParadas(tipo: string): void {
    if (tipo === 'ppg - centro') {
      this.paradasFiltradas = this.paradas.slice(0, 10);  // Mostrar paradas de la 1 a la 10
    } else if (tipo === 'Ppg centro- ppg base') {
      this.paradasFiltradas = this.paradas.slice(10, 20); // Mostrar paradas de la 11 a la 20
    }
    this.mostrarMapa();
  }
  private processWebSocketMessage(message: string): void {
    const parts = message.split(',');

    const deviceName = parts[0];
    const latitud = parseFloat(parts[1]);
    const longitud = parseFloat(parts[2]);

    const messageData: MessageData = { deviceName, latitud, longitud };
    this.messages.push(messageData);
    console.log("parsed", deviceName, latitud, longitud);

    if (this.deviceMarker) {
      this.deviceMarker.setLatLng([latitud, longitud]);
    } else {
      this.deviceMarker = L.marker([latitud, longitud], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/5706/5706850.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(this.map);
    }


    this.messageCount++;
    if (this.messageCount % 20 === 0) {
      this.refreshTable();
    }
  }

  private refreshTable(): void {
    this.messages = [];
    this.cdr.detectChanges();
    console.log("Tabla refrescada después de 20 mensajes");
  }

  private mostrarMapa(): void {
    if (this.map) {
      this.map.remove(); // Elimina el mapa existente
    }
    this.map = L.map('map').setView([18.365533730224822, -99.53496845259609], 16);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  
    // Limpiar los marcadores anteriores
    this.paradaMarkers.forEach(marker => marker.remove());
    this.paradaMarkers = [];
  
    // Agregar los nuevos marcadores para las paradas filtradas
    this.paradasFiltradas.forEach((parada, index) => {
      const markerIconUrl = this.paradasVisitadas[index] ? 
        'https://cdn-icons-png.flaticon.com/512/1287/1287128.png' : 
        customIcon.options.iconUrl;
  
      const marker = L.marker([parada.latitud, parada.longitud], {
        icon: L.icon({
          iconUrl: markerIconUrl,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(this.map);
  
      marker.bindPopup(`No.: ${parada.id} Trayecto: ${parada.trayecto}`).openPopup();
      this.paradaMarkers.push(marker);
    });
  
    // Añadir un nuevo marcador con un icono personalizado en una ubicación específica
    const newIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  
    L.marker([18.3658589065293, -99.534859830995], {  // Coordenadas del nuevo marcador
      icon: newIcon
    }).addTo(this.map).bindPopup('Tu estas aquí').openPopup();
  }
  
  calcularDistanciaHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distancia en kilómetros
    return d;
  }
    // Convierte grados a radianes
    degToRad(degrees: number): number {
      return degrees * (Math.PI / 180);
    }
    toggleMapVisibility(): void {
      this.isMapVisible = !this.isMapVisible;
      if (this.isMapVisible && this.map) {
        window.location.reload();
      }
    }
    showDetails(parada: any) {
      const nextParada = this.paradas.find(p => p.id === (parseInt(parada.id) + 1).toString());

    // Calcula la distancia si hay una parada siguiente
    const distancia = nextParada ? this.calcularDistanciaHaversine(parada.latitud, parada.longitud, nextParada.latitud, nextParada.longitud) : 'N/A';
      Swal.fire({
        
        title: 'Detalles de la Parada',
        html: `
          <p><strong>ID:</strong> ${parada.id}</p>
          <p><strong>Trayecto:</strong> ${parada.trayecto}</p>
                 <p><strong>Distancia a la siguiente parada:</strong> ${distancia} km</p>

        `,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    }
    showLocationAlert() {
      Swal.fire({
        title: 'Cargando...',
        text: 'Estamos intentando obtener tu ubicación.',
        icon: 'info',
        allowOutsideClick: false,  // Evita que se cierre al hacer clic fuera
        didOpen: () => {
          Swal.showLoading(); // Muestra el indicador de carga
        }
      });
    
      // Después de 10 segundos, cambia la alerta para indicar éxito
      setTimeout(() => {
        Swal.fire({
          title: 'Ubicación obtenida',
          text: 'La ubicación fue obtenida con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }, 10000); // 10000 ms = 10 segundos
    }
    
}
