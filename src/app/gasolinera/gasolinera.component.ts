import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import {  Fuel } from '../clases/Fuel';

declare let require: any;
const GasStation_artifacts = require('../../../build/contracts/GasStation.json');

@Component({
  selector: 'app-gasolinera',
  templateUrl: './gasolinera.component.html',
  styleUrls: ['./gasolinera.component.css']
})
export class GasolineraComponent implements OnInit {
  
  //contrato
  GasStation: any;
  accounts: string[];
  status: string;
  model = {
    amount: 0,
    receiver: '',
    name: '',
    account: ''
  };

  //sobre la gasolinera
  idStation: number;
  deposito: number;
  cantidadFuels:number;
  Fuels:Fuel[] = [];
  buscadoestacion:boolean;
  //sobre el tipo de gas
  tipogas:number;
  precioGas:number;
  cantidadDisponible:number;

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
   }
   ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(GasStation_artifacts)
      .then((GasEstationAbstraction) => {
        this.GasStation = GasEstationAbstraction;
        this.GasStation.deployed().then(deployed => {
          console.log("deployed "+deployed);  
        });

      });
  }
  
  async searchStation(){
    if (!this.GasStation) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }
   this.setStatus('Initiating transaction... (please wait)');
   this.buscadoestacion=true;
    try {
      const deployedGasStation = await this.GasStation.deployed();
      //falta validar si existe la gasolinera
      
      const getinfoGasolinera = await deployedGasStation.getStationGasInfo.call(this.idStation);
      console.log(getinfoGasolinera);
      this.deposito=getinfoGasolinera[0];
      this.cantidadFuels=getinfoGasolinera[1];
      this.Fuels=[];
      for (let i = 0; i < this.cantidadFuels; i++) {
        //getGasInfo(uint idStation, uint idfuel)
        const infoFuel = await deployedGasStation.getGasInfo.call(this.idStation, i,{from: this.model.account});
        console.log(infoFuel);
        //id,precio,cant
        var fuel= new Fuel(infoFuel[0],infoFuel[1],infoFuel[2])
        this.Fuels.push(fuel);
      }
      if (!getinfoGasolinera ) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error; see log.');
    }
  }

  async sendFuel(){
    if (!this.GasStation) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }
   this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedGasStation = await this.GasStation.deployed();
      //falta validar si existe la gasolinera
      //setStationFuel(uint id,TipoGas tipo, uint price, uint cantidadDisp)
      console.log(this.idStation+" "+ this.tipogas+" "+this.precioGas+" "+this.cantidadDisponible)
      const getinfoGasolinera = await deployedGasStation.setStationFuel.sendTransaction(this.idStation, this.tipogas,this.precioGas,this.cantidadDisponible,{from: this.model.account});
      console.log(getinfoGasolinera);
      this.deposito=getinfoGasolinera[0];
      this.cantidadFuels=getinfoGasolinera[1];
      this.Fuels=[];
      if (!getinfoGasolinera ) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error; see log.');
    }
  }
  
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
    
    });
  }

  
  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }


}
