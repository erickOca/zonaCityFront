import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SeguimientoRutaComponent } from './seguimiento-ruta/seguimiento-ruta.component';
import { RutasComponent } from './rutas/rutas.component';
import { MapaComponent } from './mapa/mapa.component';
import { MapaAutoridadComponent } from './mapa-autoridad/mapa-autoridad.component';
import { MapaPermisionarioComponent } from './mapa-permisionario/mapa-permisionario.component';
import { Mapa2Component } from './mapa2/mapa2.component';
import { MapaMqComponent } from './components/mapa-mq/mapa-mq.component';
import { CeldaComponent } from './celda/celda/celda.component';

const routes: Routes = [
  { path: '',      component: LoginComponent },
  { path: 'mapa',      component: MapaComponent },
  { path: 'mapaAdmi',      component: MapaAutoridadComponent },
  { path: 'mapa2',      component: Mapa2Component },
  { path: 'mqtt',      component: MapaMqComponent },
  { path: 'celda',      component: CeldaComponent }





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
