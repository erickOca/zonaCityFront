import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SeguimientoRutaComponent } from './seguimiento-ruta/seguimiento-ruta.component';
import { RutasComponent } from './rutas/rutas.component';
import { MapaComponent } from './mapa/mapa.component';
import { MapaAutoridadComponent } from './mapa-autoridad/mapa-autoridad.component';
import { MapaPermisionarioComponent } from './mapa-permisionario/mapa-permisionario.component';

const routes: Routes = [
  { path: '',      component: MapaComponent },
  { path: 'mapa',      component: MapaComponent },
  { path: 'mapaPermi',      component: MapaPermisionarioComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
