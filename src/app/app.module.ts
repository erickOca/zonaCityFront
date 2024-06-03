import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet'; // Importa LeafletModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaComponent } from './mapa/mapa.component';
import { SeguimientoRutaComponent } from './seguimiento-ruta/seguimiento-ruta.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RutasComponent } from './rutas/rutas.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importa FormsModule
import {MatSliderModule} from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MapaAutoridadComponent } from './mapa-autoridad/mapa-autoridad.component';
import { MapaPermisionarioComponent } from './mapa-permisionario/mapa-permisionario.component';
import { RutasPermisionarioComponent } from './rutas-permisionario/rutas-permisionario.component';
import { HttpClientModule } from '@angular/common/http';
import { CeldaComponent } from './celda/celda/celda.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { Mapa2Component } from './mapa2/mapa2.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    SeguimientoRutaComponent,
    NavbarComponent,
    FooterComponent,
    RutasComponent,
    LoginComponent,
    MapaAutoridadComponent,
    MapaPermisionarioComponent,
    RutasPermisionarioComponent,
    CeldaComponent,
    Mapa2Component
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    FormsModule,
    NoopAnimationsModule,
    MatSliderModule,
    MatFormFieldModule, 
    MatSelectModule,
     MatInputModule,
     MatFormFieldModule,
     MatInputModule,
     MatTableModule,
     HttpClientModule,
     MatExpansionModule,
     NgxGraphModule
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
