import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";
import { Subscription } from 'rxjs';
import { MessageData } from 'src/app/models/MessageData';
import { TrayectoService } from 'src/app/services/trayecto.service';
import { WebsocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-mapa-mq',
  templateUrl: './mapa-mq.component.html',
  styleUrls: ['./mapa-mq.component.css']
})
export class MapaMqComponent implements OnInit {
  paradas: any[] = [];
  paradaMarkers: L.Marker[] = [];
  paradasVisitadas: boolean[] = []; // Array para almacenar las paradas visitadas
  public messages: MessageData[] = [];  private subscription: Subscription | undefined;
  private deviceMarker: L.Marker | undefined;
  private map!: L.Map;  // Asegurar que this.map no sea undefined

  constructor(private mapService: TrayectoService, private webSocketService: WebsocketService) { }
  ngOnInit(): void {
    // Obtener paradas desde el servicio TrayectoService
    this.mapService.getAllStops().subscribe(data => {
      this.paradas = data;
      this.mostrarMapa();
    });
    this.webSocketService.connect().subscribe(
      (message: string) => {
        // Llamar al método para procesar el mensaje
        this.processWebSocketMessage(message);
      },
      (error) => {
        console.error("Error en la suscripción WebSocket:", error);
      }
    );
  }
  private processWebSocketMessage(message: string): void {
    // Dividir el mensaje en partes usando la coma como separador
    const parts = message.split(',');

    // Asignar partes a variables
    const deviceName = parts[0]; // "Device1"
    const latitud = parseFloat(parts[1]); // 40.7128 (convertido a número)
    const longitud = parseFloat(parts[2]); // -74.06 (convertido a número)

    // Crear un objeto de tipo MessageData y agregarlo al array de mensajes
    const messageData: MessageData = { deviceName, latitud, longitud };
    this.messages.push(messageData);
    console.log("parsed" + deviceName, latitud, longitud);

    // Actualizar la posición del marcador del dispositivo
    if (this.deviceMarker) {
      this.deviceMarker.setLatLng([latitud, longitud]);
    } else {
      // Si el marcador no existe, crearlo
      this.deviceMarker = L.marker([latitud, longitud], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/5706/5706850.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(this.map!); // Añadir el marcador al mapa
    }
  }

  mostrarMapa() {
    const mapContainer = document.getElementById('map');
    this.map = L.map('map').setView([this.paradas[0].latitud, this.paradas[0].longitud], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Define un icono personalizado para las paradas
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    this.paradas.forEach((parada, index) => {
      const markerIcon = this.paradasVisitadas[index] ? 'https://cdn-icons-png.flaticon.com/512/1287/1287128.png' : customIcon.options.iconUrl;
      const marker = L.marker([parada.latitud, parada.longitud], {
        icon: L.icon({ iconUrl: markerIcon, iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(this.map);

      marker.bindPopup(`No.: ${parada.id} Trayecto: ${parada.trayecto}`).openPopup();
      this.paradaMarkers.push(marker); // Agrega el marcador al array de marcadores de paradas
    });
  }
}