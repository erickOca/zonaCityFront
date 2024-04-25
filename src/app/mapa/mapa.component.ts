import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from "@angular/core";
import * as L from "leaflet";
import { StopsService } from "../services/stops.service";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  paradas: any[] = [];
  paradasVisitadas: boolean[] = []; // Array para almacenar las paradas visitadas
  marker: any; // Variable para almacenar el marcador móvil
  secondMarker: any; // Variable para almacenar el segundo marcador móvil
  currentIndex: number = 0; // Índice actual de la parada
  speedKmPerHour: number = 30; // Velocidad del marcador en km/h
  updateIntervalMs: number = 1000; // Intervalo de actualización en milisegundos
  startTime: number = 0; // Tiempo de inicio del movimiento, inicializado a 0
  distanceCovered: number = 0; // Distancia cubierta desde la última parada
  paradaMarkers: L.Marker[] = [];

  @Output() paradaActualizada = new EventEmitter<{ numero: number, trayecto: string, distancia: number, tiempoLlegada: number }>();

  constructor(private mapService: StopsService, private cdRef: ChangeDetectorRef,private el: ElementRef) { }

  ngOnInit(): void {
    this.mapService.getStops().subscribe(data => {
      this.paradas = data;
      this.paradasVisitadas = new Array(this.paradas.length).fill(false); // Inicializa el array de paradas visitadas
      this.mostrarMapa();
      this.moverIcono(); // Llama al método para mover el icono después de mostrar el mapa
      this.cdRef.detectChanges();
      this.aplicarEstiloColumna(); 
      // Emitir evento cada segundo
      setInterval(() => {
        this.emitirEventoActualizado();
      }, 1000);
    });
  }
  aplicarEstiloColumna() {
    const columnas = this.el.nativeElement.getElementsByTagName('td'); // Obtener todas las celdas de la tabla
    Array.from(columnas).forEach((celda: any) => {
      const fontWeight = window.getComputedStyle(celda).getPropertyValue('font-weight');
      if (fontWeight === 'bold' || fontWeight === '700' || fontWeight === 'bolder') { // Verificar si el texto de la celda está en negrita
        celda.style.backgroundColor = 'red'; // Aplicar estilo de fondo verde a la celda
      }
    });
  }
  
  
  mostrarMapa() {
    const mapContainer = document.getElementById('map');

    const map = L.map('map').setView([this.paradas[0].latitud, this.paradas[0].longitud], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define un icono personalizado para las paradas
    const customIcon = L.icon({
      iconUrl: 'assets/img/paradas.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    this.paradas.forEach((parada, index) => {
      const marker = L.marker([parada.latitud, parada.longitud], { icon: customIcon }).addTo(map);
      marker.bindPopup('No.: ' + parada.id + 'Trayecto: ' + parada.trayecto).openPopup();
      this.paradaMarkers.push(marker); // Agrega el marcador al array de marcadores de paradas
    });

    // Define un arreglo de coordenadas para la polilínea
    const polylineCoords = this.paradas.map(parada => [parada.latitud, parada.longitud]);

    // Agrega la polilínea al mapa
    L.polyline(polylineCoords, { color: 'red' }).addTo(map);

    // Define un icono personalizado para el marcador móvil
    const movingIcon = L.icon({
      iconUrl: 'assets/img/auto.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Agrega el marcador móvil principal
    this.marker = L.marker([this.paradas[0].latitud, this.paradas[0].longitud], { icon: movingIcon }).addTo(map);

    // Agrega el segundo marcador móvil con una diferencia de 7 paradas
    const secondIcon = L.icon({
      iconUrl: 'assets/img/taxi.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.secondMarker = L.marker([this.paradas[7].latitud, this.paradas[7].longitud], { icon: secondIcon }).addTo(map);
  }

  moverIcono() {
    this.startTime = Date.now();
    let currentIndex = this.currentIndex;
    let remainingDistanceToNextStop = this.calcularDistanciaHaversine(
      this.marker.getLatLng().lat,
      this.marker.getLatLng().lng,
      this.paradas[currentIndex + 1].latitud,
      this.paradas[currentIndex + 1].longitud
    );

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime; // Tiempo transcurrido desde el inicio en milisegundos
      const distanceTraveled = (this.speedKmPerHour * elapsedTime) / (60 * 60 * 1000); // Distancia recorrida en km

      // Actualiza la posición del marcador principal
      const newPosition = this.getPositionAtDistance(distanceTraveled);
      this.marker.setLatLng([newPosition.lat, newPosition.lng]);

      // Actualiza la posición del segundo marcador con una diferencia de 7 paradas
      const secondPosition = this.getPositionAtDistance(distanceTraveled + 7 * this.speedKmPerHour * elapsedTime / (60 * 60 * 1000));
      this.secondMarker.setLatLng([secondPosition.lat, secondPosition.lng]);

      // Actualiza la distancia restante hasta la próxima parada
      remainingDistanceToNextStop -= distanceTraveled;

      // Si llega a la próxima parada, actualiza el índice y marca la parada como visitada
      if (remainingDistanceToNextStop <= 0 && currentIndex < this.paradas.length - 2) {
        currentIndex++;
        this.paradasVisitadas[currentIndex] = true; // Marcar la parada como visitada

        remainingDistanceToNextStop = this.calcularDistanciaHaversine(
          newPosition.lat,
          newPosition.lng,
          this.paradas[currentIndex + 1].latitud,
          this.paradas[currentIndex + 1].longitud
        );

        // Restablecer el tooltip de la parada anterior
        const stopMarker = this.paradaMarkers[currentIndex - 1];
        if (stopMarker) {
          stopMarker.unbindTooltip();
        }

        // Calcula el tiempo estimado de llegada a la próxima parada
        const estimatedTimeToStop = (remainingDistanceToNextStop / this.speedKmPerHour) * 60; // Convertir horas a minutos

        // Actualiza el contenido del marcador con el número de parada y el tiempo de llegada estimado
        this.marker.bindPopup(`<b>Parada ${currentIndex + 2}</b><br>Tiempo estimado: ${estimatedTimeToStop.toFixed(2)} minutos`);

        // Actualiza el tooltip de la parada con el tiempo estimado de llegada
        const currentStopMarker = this.paradaMarkers[currentIndex];
        if (currentStopMarker) {
          currentStopMarker.bindTooltip(`Tiempo estimado de llegada: ${estimatedTimeToStop.toFixed(2)} minutos`).openTooltip();
        }

        // Detecta cambios para actualizar la vista
        this.cdRef.detectChanges();
      }

      // Si llega a la última parada, detiene el intervalo
      if (currentIndex === this.paradas.length - 1) {
        clearInterval(intervalId);
      }
    }, this.updateIntervalMs);
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
  emitirEventoActualizado() {
    this.paradaActualizada.emit({
      numero: this.currentIndex + 1,
      trayecto: this.paradas[this.currentIndex].trayecto,
      distancia: this.distanceCovered,
      tiempoLlegada: Date.now() // Aquí puedes modificar el tiempo de llegada según tus necesidades
    });
  }
}  