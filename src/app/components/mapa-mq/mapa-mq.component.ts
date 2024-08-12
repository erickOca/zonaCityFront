import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  public messages: MessageData[] = [];  
  private subscription: Subscription | undefined;
  private deviceMarker: L.Marker | undefined;
  private map!: L.Map;  // Asegurar que this.map no sea undefined
  private messageCount: number = 0; // Contador de mensajes recibidos

  constructor(
    private mapService: TrayectoService,
    private webSocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Iniciar el mapa sin las paradas
    this.mostrarMapa();

    // Conectarse al WebSocket y manejar los mensajes entrantes
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
    // Dividir el mensaje en partes usando la coma como separador
    const parts = message.split(',');

    // Asignar partes a variables
    const deviceName = parts[0]; // "Device1"
    const latitud = parseFloat(parts[1]); // 40.7128 (convertido a número)
    const longitud = parseFloat(parts[2]); // -74.06 (convertido a número)

    // Crear un objeto de tipo MessageData y agregarlo al array de mensajes
    const messageData: MessageData = { deviceName, latitud, longitud };
    this.messages.push(messageData);
    console.log("parsed", deviceName, latitud, longitud);

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
    this.map.setView([latitud, longitud], 16); // 16 es el nivel de zoom

    // Incrementar el contador de mensajes y verificar si se debe refrescar la tabla
    this.messageCount++;
    if (this.messageCount % 20 === 0) {
      this.refreshTable();
    }
  }

  private refreshTable(): void {
    // Lógica para refrescar la tabla
    this.messages = [];
    this.cdr.detectChanges(); // Forzar la detección de cambios
    console.log("Tabla refrescada después de 20 mensajes");
  }

  mostrarMapa() {
    const mapContainer = document.getElementById('map');
    this.map = L.map('map').setView([0, 0], 2); // Configura una vista inicial global

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Aquí eliminamos la lógica para mostrar las paradas
    // Ya no se crean ni se añaden los marcadores de las paradas al mapa.
  }
}
