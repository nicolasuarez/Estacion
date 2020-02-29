import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import {  Fuel } from '../clases/Fuel';


declare let require: any;
const GasStation_artifacts = require('../../../build/contracts/GasStation.json');
@Component({
  selector: 'app-registrar-carro',
  templateUrl: './registrar-carro.component.html',
  styleUrls: ['./registrar-carro.component.css']
})
export class RegistrarCarroComponent implements OnInit {
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
  //fuel
  tipogas:number;
  precioGas:number;
  cantidadDisponible:number;
  cantidadSolicitada:number;
  //deposito
  depositous:number;
  total:number;
  
  //CARRO
  idCarro: number;

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


  async sendDeposit(){
    if (!this.GasStation) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }
   this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedGasStation = await this.GasStation.deployed();
      //falta validar si existe la gasolinera
      //buscando fuel
      const getinfofuel = await deployedGasStation. getGasInfo.call(this.idStation,this.tipogas);
      console.log(getinfofuel);
      this.precioGas=getinfofuel[1];
      this.cantidadDisponible=getinfofuel[2];
      //sendDeposit(uint idStation, uint idVehiculo, TipoGas tipo,uint cantidadSolicitada )
      const sendDepositTransact = await deployedGasStation.sendDeposit.sendTransaction(this.idStation,
        this.idCarro,this.tipogas,this.cantidadSolicitada,{from: this.model.account,value:this.deposito});
      console.log(sendDepositTransact );
      
      this.total=this.cantidadSolicitada*this.precioGas;
      if (!sendDepositTransact  ) {
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
      //sendFuel(uint _station,uint Vehiculo, uint fuel, uint cantidadSolicitada)
      const getinfoGasolinera = await deployedGasStation.sendFuel.sendTransaction(this.idStation,
        this.idCarro,this.tipogas,this.cantidadSolicitada,{from: this.model.account});
      console.log(getinfoGasolinera);
      
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

  async consultarDeposito(){
    if (!this.GasStation) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }
   this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedGasStation = await this.GasStation.deployed();
      //falta validar si existe la gasolinera
      const getinfoGasolinera = await deployedGasStation.consultarSaldoEstacion.call(this.idStation,this.idCarro);
      console.log(getinfoGasolinera);
      this.depositous=getinfoGasolinera;
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
