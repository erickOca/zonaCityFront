import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SeguimientoRutaComponent } from './seguimiento-ruta/seguimiento-ruta.component';
import { RutasComponent } from './rutas/rutas.component';
import { MapaComponent } from './mapa/mapa.component';

const routes: Routes = [
  { path: '',      component: LoginComponent },
  { path: 'mapa',      component: MapaComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
