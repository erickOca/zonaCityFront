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
    this.trayectoService.getAllStops().subscribe(data => {
      this.paradas = data;
      this.mostrarMapa();
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

    this.map.setView([latitud, longitud], 16);

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
    this.map = L.map('map').setView([this.paradas[0].latitud, this.paradas[0].longitud], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    this.paradas.forEach((parada, index) => {
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
}
