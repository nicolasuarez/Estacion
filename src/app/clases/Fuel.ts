export class Fuel {
    id: number;
    precio: number;
    cantDisponible:number;
    
    constructor(id: number,precio: number,cant: number){
      this.id=id;
      this.precio=precio;
      this.cantDisponible=cant;
    }
   
  }