import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from "@angular/core";
import * as L from "leaflet";
import Swal from "sweetalert2";
import { StopsService } from "../services/stops.service";
import { Node, Edge, DagreSettings, Alignment } from '@swimlane/ngx-graph'; // Importa Node y Link desde ngx-graph
import { Orientation } from '@swimlane/ngx-graph';
import { Stops2Service } from "../services/stops2.service";

@Component({
  selector: 'app-mapa2',
  templateUrl: './mapa2.component.html',
  styleUrls: ['./mapa2.component.css']
})
export class Mapa2Component implements OnInit {

  paradas: any[] = [];
  paradasVisitadas: boolean[] = []; // Array para almacenar las paradas visitadas
  marker: any; // Variable para almacenar el marcador móvil
  secondMarker: any; // Variable para almacenar el segundo marcador móvil
  currentIndex: number = 0; // Índice actual de la parada
  speedKmPerHour: number = 10; // Velocidad del marcador en km/h
  updateIntervalMs: number = 3000; // Intervalo de actualización en milisegundos
  startTime: number = 0; // Tiempo de inicio del movimiento, inicializado a 0
  distanceCovered: number = 0; // Distancia cubierta desde la última parada
  paradaMarkers: L.Marker[] = [];
  celdasConCirculo: boolean[] = [false, false, false]; // Definir correctamente la propiedad celdasConCirculo
  nodes: any[] = []; // Array de nodos para ngx-graph
  edges: any[] = []; // Array de enlaces para ngx-graph
  @Output() paradaActualizada = new EventEmitter<{ numero: number, trayecto: string, distancia: number, tiempoLlegada: number }>();

  constructor(private mapService: Stops2Service, private cdRef: ChangeDetectorRef, private el: ElementRef) { }

  ngOnInit(): void {
    this.mapService.getStops().subscribe(data => {
      this.paradas = data;
      this.mostrarMapa();
      this.moverIcono(); // Llama al método para mover el icono después de mostrar el mapa
      
      this.cdRef.detectChanges();

      // Emitir evento cada segundo
      setInterval(() => {
      }, 1000);
    });
  }

  mostrarMapa() {
    const mapContainer = document.getElementById('map');
    const map = L.map('map').setView([this.paradas[0].latitud, this.paradas[0].longitud], 16);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Define un icono personalizado para las paradas
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  
    this.paradas.forEach((parada, index) => {
      const markerIcon = this.paradasVisitadas[index] ? 'https://cdn-icons-png.flaticon.com/512/1287/1287128.png' : customIcon.options.iconUrl;
      const marker = L.marker([parada.latitud, parada.longitud], { icon: L.icon({ iconUrl: markerIcon, iconSize: [32, 32], iconAnchor: [16, 16] }) }).addTo(map);
      marker.bindPopup('No.: ' + parada.id + ' Trayecto: ' + parada.trayecto ).openPopup();
      this.paradaMarkers.push(marker); // Agrega el marcador al array de marcadores de paradas
    
     
    });
  
    const polylineCoords = this.paradas.map(parada => [parada.latitud, parada.longitud]);
    L.polyline(polylineCoords, { color: 'red', smoothFactor: 10 }).addTo(map); // Ajusta smoothFactor según sea necesario
  
    // Define un icono personalizado para el marcador móvil
    const movingIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/5706/5706850.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  
    // Agrega el marcador móvil principal
    this.marker = L.marker([this.paradas[0].latitud, this.paradas[0].longitud], { icon: movingIcon }).addTo(map);
  
    // Agrega el segundo marcador móvil con una diferencia de 7 paradas
    const secondIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/5706/5706850.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    const movingIcon3 = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/5706/5706850.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  
    this.secondMarker = L.marker([this.paradas[19].latitud, this.paradas[19].longitud], { icon: secondIcon }).addTo(map);
  }
  moverIcono() {
    this.startTime = Date.now();
    let currentIndex = this.currentIndex;
    let currentIndexSecondMarker = 19; // Inicializa currentIndexSecondMarker en 18
    let distanceCovered = 0;

    const moveMarker = () => {
        const elapsedTime = Date.now() - this.startTime; // Tiempo transcurrido desde el inicio en milisegundos
        const distanceTraveled = (this.speedKmPerHour * elapsedTime) / (60 * 60 * 1000); // Distancia recorrida en km

        // Actualiza la posición del marcador principal
        const newPosition = this.getPositionAtDistance(distanceTraveled);
        this.marker.setLatLng([newPosition.lat, newPosition.lng]);

        // Si llega a la próxima parada, actualiza el índice y marca la parada como visitada
        if (distanceTraveled >= distanceCovered && currentIndex < this.paradas.length - 1) {
            currentIndex++;
            this.paradasVisitadas[currentIndex] = true; // Marcar la parada como visitada

            // Actualiza el color de fondo de la columna correspondiente
            const column = document.getElementById('columna-' + currentIndex);
            if (column) {
                column.style.backgroundColor = 'green'; // Cambia el color de fondo de la columna a verde
            }

            // Restablecer el tooltip de la parada anterior
            const stopMarker = this.paradaMarkers[currentIndex - 1];
            if (stopMarker) {
                stopMarker.unbindTooltip();
            }

            // Marca la parada como visitada en la lista paradasVisitadas
            this.paradasVisitadas[currentIndex] = true;

            // Detecta cambios para actualizar la vista
            this.cdRef.detectChanges();

            // Actualiza la distancia cubierta para la próxima parada
            distanceCovered += this.calcularDistanciaHaversine(
                this.paradas[currentIndex - 1].latitud,
                this.paradas[currentIndex - 1].longitud,
                this.paradas[currentIndex].latitud,
                this.paradas[currentIndex].longitud
            );

            // Detener el movimiento del marcador durante 2 segundos
            setTimeout(() => {
                // Continuar moviendo el marcador después de 2 segundos
                requestAnimationFrame(moveMarker);
            }, 4000);
        } else {
            // Si no ha llegado a la próxima parada, continúa moviendo el marcador
            requestAnimationFrame(moveMarker);
        }

        // Actualiza la posición del segundo marcador
        const newPositionSecond = this.getPositionAtDistanceForSecondMarker(distanceTraveled, currentIndexSecondMarker);
        this.secondMarker.setLatLng([newPositionSecond.lat, newPositionSecond.lng]);
    };

    // Comienza a mover el marcador
    moveMarker();
}


  getPositionAtDistanceForSecondMarker(distance: number, currentIndexSecondMarker: number): { lat: number, lng: number } {
    let remainingDistance = distance;
    let currentIndex = currentIndexSecondMarker;

    while (currentIndex < this.paradas.length - 1) {
      const currentStop = this.paradas[currentIndex];
      const nextStop = this.paradas[currentIndex + 1];
      const segmentDistance = this.calcularDistanciaHaversine(currentStop.latitud, currentStop.longitud, nextStop.latitud, nextStop.longitud);

      if (segmentDistance > remainingDistance) {
        const bearing = this.calculateBearing(currentStop.latitud, currentStop.longitud, nextStop.latitud, nextStop.longitud);
        const newPosition = this.calculateDestination(currentStop.latitud, currentStop.longitud, bearing, remainingDistance);
        return newPosition;
      } else {
        remainingDistance -= segmentDistance;
        currentIndex++;
      }
    }

    // Si llega al final, devuelve la última posición
    return { lat: this.paradas[this.paradas.length - 1].latitud, lng: this.paradas[this.paradas.length - 1].longitud };
  }

  getPositionAtDistance(distance: number): { lat: number, lng: number } {
    let remainingDistance = distance;
    let currentIndex = this.currentIndex;

    while (currentIndex < this.paradas.length - 1) {
      const currentStop = this.paradas[currentIndex];
      const nextStop = this.paradas[currentIndex + 1];
      const segmentDistance = this.calcularDistanciaHaversine(currentStop.latitud, currentStop.longitud, nextStop.latitud, nextStop.longitud);

      if (segmentDistance > remainingDistance) {
        const bearing = this.calculateBearing(currentStop.latitud, currentStop.longitud, nextStop.latitud, nextStop.longitud);
        const newPosition = this.calculateDestination(currentStop.latitud, currentStop.longitud, bearing, remainingDistance);
        this.distanceCovered += remainingDistance;
        return newPosition;
      } else {
        remainingDistance -= segmentDistance;
        currentIndex++;
      }
    }

    // Si llega al final, devuelve la última posición
    return { lat: this.paradas[this.paradas.length - 1].latitud, lng: this.paradas[this.paradas.length - 1].longitud };
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

  // Calcula el rumbo entre dos puntos
  calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.degToRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(this.degToRad(lat2));
    const x = Math.cos(this.degToRad(lat1)) * Math.sin(this.degToRad(lat2)) -
      Math.sin(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = this.radToDeg(brng);
    return (brng + 360) % 360;
  }

  // Calcula la posición de destino desde un punto inicial, un rumbo y una distancia
  calculateDestination(lat: number, lon: number, bearing: number, distance: number): { lat: number, lng: number } {
    const R = 6371; // Radio de la Tierra en kilómetros
    const d = distance / R; // Distancia angular en radianes
    const brng = this.degToRad(bearing); // Rumbo en radianes
    const lat1 = this.degToRad(lat);
    const lon1 = this.degToRad(lon);

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
    return { lat: this.radToDeg(lat2), lng: this.radToDeg(lon2) };
  }

  // Convierte radianes a grados
  radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
  }

}
