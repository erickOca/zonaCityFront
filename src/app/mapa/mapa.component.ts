import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.mostrarSweetAlert();
    const map = L.map('map').setView([18.3633579, -99.5410202], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Definir el icono personalizado para las paradas
    const stopIcon = L.icon({
      iconUrl: "/assets/img/paradas.png",
      iconSize: [32, 32], // Tamaño del icono en píxeles
      iconAnchor: [16, 16] // Punto de anclaje del icono (centro)
    });

    // Definir el icono personalizado para el carrito
    const carIcon = L.icon({
      iconUrl: "/assets/img/autobus.png",
      iconSize: [32, 32], // Tamaño del icono en píxeles
      iconAnchor: [16, 16] // Punto de anclaje del icono (centro)
    });

    // Definir el icono personalizado para la nueva ubicación
    const otroIcono = L.icon({
      iconUrl: "/assets/img/yo.webp",
      iconSize: [32, 32], // Tamaño del icono en píxeles
      iconAnchor: [16, 16] // Punto de anclaje del icono (centro)
    });

    // Array de paradas
    const stops: [number, number][] = [
      [18.360756648849712, -99.54087749708359],
      [18.36123186287153, -99.54055886693152],
      [18.36255253042336, -99.53924130285915],
      [18.36267362194458, -99.53904354134644],
      [18.362679676518404, -99.53912647359371],
      [18.36274627681653, -99.53898612671374],
      [18.36313376895045, -99.53875646818288],
      [18.36314530464164, -99.53867586338568],
      [18.363881517070883, -99.53794913425742],
      [18.36460152477089, -99.53734221968203],
      [18.36461592489424, -99.53705393525873],
      [18.364961527494536, -99.53687186088614],
      [18.365739130814838, -99.53614356339565]
    ];

    // Agregar marcadores de paradas al mapa
    stops.forEach(stop => {
      const stopMarker = L.marker(stop, { icon: stopIcon }).addTo(map);
      
      // Agregar evento de clic al marcador de parada
      stopMarker.on('click', () => {
        // Mostrar mensaje de SweetAlert
        Swal.fire({
          title: 'La siguiente unidad llegará en 5 minutos. \nProximas unidades:',
          html: '<table style="width:100%"><tr><th>Unidad</th><th>Destino</th><th>Tiempo estimado</th></tr><tr><td>10</td><td>PPG-Center</td><td>5 minutos</td></tr><tr><td>45</td><td>PPG</td><td>20 minutos</td></tr><tr><td>5</td><td>PPG-Zocalo-Center</td><td>30 minutos</td></tr></table>',
          icon: 'info',
          confirmButtonText: 'Cerrar'
        });
        
        
        
      });
    });

    // Marcador inicial del carrito
    const carMarker = L.marker(stops[0], { icon: carIcon }).addTo(map);

    // Agregar marcador en la nueva ubicación con un icono diferente
    const nuevaUbicacion = L.marker([18.361089462484465, -99.54025934134712], { icon: otroIcono }).addTo(map);

    // Iterar sobre las paradas y mover el carrito
    stops.forEach((stop, index) => {
      // Ignora la primera parada ya que ya se agregó
      if (index === 0) return;

      // Calcula la distancia entre las paradas
      const distance = map.distance(stops[index - 1], stop); // Calcula la distancia entre dos puntos
      const speed = 1000; // Velocidad del carrito (en milisegundos)
      const duration = 5 * 1000; // Duración de 30 segundos en milisegundos

      // Mueve el carrito a la siguiente parada con animación
      setTimeout(() => {
        carMarker.setLatLng(stop);
      }, duration * index); // Espera el tiempo necesario antes de mover a la siguiente parada
    });

    // Agregar evento de clic al marcador del carrito
    carMarker.on('click', () => {
      // Mostrar mensaje de SweetAlert
      Swal.fire({
        title: 'Detalles de la unidad 106',
        text: 'Zocalo-Catalina Pastrana - 10/14 pasajeros',
        icon: 'info',
        confirmButtonText: 'Cerrar'
      });
    });

    nuevaUbicacion.on('click', () => {
      // Mostrar mensaje de SweetAlert
      Swal.fire({
        title: 'TU Ubicacion actual es: ',
        text: 'Calle Catalina Pastrana',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  mostrarSweetAlert() {
    // Utilizar SweetAlert para preguntar al usuario sobre su ubicación
    Swal.fire({
      title: 'Confirmar ubicación',
      text: '¿Tu ubicación es Iguala De La Independencia, Guerrero, México?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        // Si el usuario selecciona "Sí", hacer algo
        Swal.fire('¡Excelente!', 'Tu ubicación es Iguala De La Independencia, Guerrero, México.', 'success');
      } else {
        // Si el usuario selecciona "No", hacer algo diferente
        Swal.fire('Oh, lo siento', 'Tu ubicación no es Iguala De La Independencia, Guerrero, México.', 'info');
      }
    });
  }
}
