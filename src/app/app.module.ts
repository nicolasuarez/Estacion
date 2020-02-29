import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from './app.component';
import {MetaModule} from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import { RegistrarCarroComponent } from './registrar-carro/registrar-carro.component';
import { InicioComponent } from './inicio/inicio.component';
import { GasolineraComponent } from './gasolinera/gasolinera.component';
import { AgregarGasolineraComponent } from './agregar-gasolinera/agregar-gasolinera.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrarCarroComponent,
    InicioComponent,
    GasolineraComponent,
    AgregarGasolineraComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
