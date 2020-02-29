import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GasolineraComponent } from './app/gasolinera/gasolinera.component';
import { AgregarGasolineraComponent } from './app/agregar-gasolinera/agregar-gasolinera.component';
import { InicioComponent } from './app/inicio/inicio.component';
import { RegistrarCarroComponent } from './app/registrar-carro/registrar-carro.component';
import {APP_BASE_HREF} from '@angular/common';

const routes: Routes = [
  {path:'', component: InicioComponent},
  {path:'gasolinera', component: GasolineraComponent},
  {path:'agregar-gasolinera', component: AgregarGasolineraComponent},
  {path:'registrar-carro', component: RegistrarCarroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})

export class AppRoutingModule { }