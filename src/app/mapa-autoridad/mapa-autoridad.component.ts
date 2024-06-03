import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from "@angular/core";
import * as L from "leaflet";
import { StopsService } from "../services/stops.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-mapa-autoridad',
  templateUrl: './mapa-autoridad.component.html',
  styleUrls: ['./mapa-autoridad.component.css']
})
export class MapaAutoridadComponent implements OnInit, AfterViewInit {
  marcadores: { latitud: number, longitud: number }[] = [];

  paradas: any[] = [];
  paradasVisitadas: boolean[] = []; // Array para almacenar las paradas visitadas
  marker: any; // Variable para almacenar el marcador móvil
  secondMarker: any; // Variable para almacenar el segundo marcador móvil
  currentIndex: number = 0; // Índice actual de la parada
  speedKmPerHour: number = 40; // Velocidad del marcador en km/h
  updateIntervalMs: number = 5000; // Intervalo de actualización en milisegundos
  startTime: number = 0; // Tiempo de inicio del movimiento, inicializado a 0
  distanceCovered: number = 0; // Distancia cubierta desde la última parada
  paradaMarkers: L.Marker[] = [];
  celdasConCirculo: boolean[] = [false, false, false]; // Definir correctamente la propiedad celdasConCirculo

  @Output() paradaActualizada = new EventEmitter<{ numero: number, trayecto: string, distancia: number, tiempoLlegada: number }>();

  constructor(private mapService: StopsService, private cdRef: ChangeDetectorRef, private el: ElementRef) { }

  ngAfterViewInit(): void {
    //  this.aplicarEstiloColumna();
  }

  ngOnInit(): void {
    this.mapService.getStops().subscribe(data => {
      this.paradas = data;
      this.paradasVisitadas = new Array(this.paradas.length).fill(false); // Inicializa el array de paradas visitadas
      this.mostrarMapa();
      this.moverIcono(); // Llama al método para mover el icono después de mostrar el mapa
      this.cdRef.detectChanges();
      //this.aplicarEstiloColumna(); 
      // Emitir evento cada segundo
      setInterval(() => {
        this.emitirEventoActualizado();
      }, 1000);
    });
  }

  mostrarMapa() {
    const mapContainer = document.getElementById('map');

    const map = L.map('map').setView([this.paradas[0].latitud, this.paradas[0].longitud], 14);

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

    this.secondMarker = L.marker([this.paradas[19].latitud, this.paradas[19].longitud], { icon: secondIcon }).addTo(map);
  }

  moverIcono() {
    this.startTime = Date.now();
    let currentIndex = this.currentIndex;
    let currentIndexSecondMarker = 19; // Inicializa currentIndexSecondMarker en 18

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - this.startTime; // Tiempo transcurrido desde el inicio en milisegundos
      const distanceTraveled = (this.speedKmPerHour * elapsedTime) / (60 * 60 * 1000); // Distancia recorrida en km

      // Actualiza la posición del marcador principal
      const newPosition = this.getPositionAtDistance(distanceTraveled);
      this.marker.setLatLng([newPosition.lat, newPosition.lng]);
      // Guarda los valores de posición en la estructura de datos
      this.marcadores.push({ latitud: newPosition.lat, longitud: newPosition.lng });
      console.log(`Marcador principal: Latitud ${newPosition.lat}, Longitud ${newPosition.lng}`);
      this.cdRef.detectChanges();
      // Si llega a la próxima parada, actualiza el índice y marca la parada como visitada
      if (distanceTraveled >= this.distanceCovered) {
        while (currentIndex < this.paradas.length - 1 && distanceTraveled >= this.distanceCovered) {
          currentIndex++;
          this.paradasVisitadas[currentIndex] = true; // Marcar la parada como visitada
          this.distanceCovered += this.calcularDistanciaHaversine(
            this.paradas[currentIndex - 1].latitud,
            this.paradas[currentIndex - 1].longitud,
            this.paradas[currentIndex].latitud,
            this.paradas[currentIndex].longitud
          );

          // Restablecer el tooltip de la parada anterior
          const stopMarker = this.paradaMarkers[currentIndex - 1];
          if (stopMarker) {
            stopMarker.unbindTooltip();
          }

          // Detecta cambios para actualizar la vista
          this.cdRef.detectChanges();
        }
      }

      // Actualiza la posición del segundo marcador
      const newPositionSecond = this.getPositionAtDistanceForSecondMarker(distanceTraveled, currentIndexSecondMarker);
      this.secondMarker?.setLatLng([newPositionSecond.lat, newPositionSecond.lng]);

      // Si llega a la última parada, detiene el intervalo
      if (currentIndex === this.paradas.length - 1) {
        clearInterval(intervalId);
      }

      // Emitir evento de actualización cada segundo
      this.emitirEventoActualizado();

    }, this.updateIntervalMs);
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

  emitirEventoActualizado() {
    this.paradaActualizada.emit({
      numero: this.currentIndex + 1,
      trayecto: this.paradas[this.currentIndex].trayecto,
      distancia: this.distanceCovered,
      tiempoLlegada: Date.now() // Aquí puedes modificar el tiempo de llegada según tus necesidades
    });
  }

  mostrarSweetAlert(parada: any) {
    // Calcula la distancia y el tiempo de llegada a la próxima parada
    const distancia = this.calcularDistanciaHaversine(parada.latitud, parada.longitud, this.paradas[this.currentIndex + 1]?.latitud, this.paradas[this.currentIndex + 1]?.longitud);
    const tiempoLlegada = ((distancia / this.speedKmPerHour) * 60).toFixed(2);

    // Muestra la Sweet Alert con la información de la parada
    Swal.fire({
      title: 'Información de la parada',
      html: `<strong>ID:</strong> ${parada.id}<br>
             <strong>Trayecto:</strong> ${parada.trayecto}<br>
             <strong>Distancia (km):</strong> ${distancia.toFixed(2)}<br>
             <strong>Tiempo de llegada (min):</strong> ${tiempoLlegada}`,
      icon: 'info'
    });
  }
  marcarParadaComoVisitada(index: number) {
    this.paradasVisitadas[index] = true;
  }
  
  isVisited(index: number): boolean {
    return this.paradasVisitadas[index];
  }
  
  actualizarPosicionMarcador() {
  const elapsedTime = Date.now() - this.startTime; // Tiempo transcurrido desde el inicio en milisegundos
  const distanceTraveled = (this.speedKmPerHour * elapsedTime) / (60 * 60 * 1000); // Distancia recorrida en km

  // Actualiza la posición del marcador principal
  const newPosition = this.getPositionAtDistance(distanceTraveled);
  this.marker.setLatLng([newPosition.lat, newPosition.lng]);

  // Guarda los valores de posición en la estructura de datos
  this.marcadores.push({ latitud: newPosition.lat, longitud: newPosition.lng });

  console.log(`Marcador principal: Latitud ${newPosition.lat}, Longitud ${newPosition.lng}`);
}

}
