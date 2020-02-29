import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

import { FormsModule } from '@angular/forms';
declare let require: any;
const GasStation_artifacts = require('../../../build/contracts/GasStation.json');


@Component({
  selector: 'app-agregar-gasolinera',
  templateUrl: './agregar-gasolinera.component.html',
  styleUrls: ['./agregar-gasolinera.component.css']
})
export class AgregarGasolineraComponent implements OnInit {
  name = 'Initial name from component';
  status: string;
  GasStation: any;
  accounts: string[];
  idStation: number;
  deposito: number;

  tipogas:number;
  precio:number;
  cantidaddisponible:number;
  
  model = {
    amount: 0,
    receiver: '',
    name: '',
    account: ''
  };
  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
   console.log('Constructor: ' + web3Service);
   this.cantidaddisponible = 0;
   
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
  
  async RegistrarEstacion(){
    if (!this.GasStation) {
        this.setStatus('Metacoin is not loaded, unable to send transaction');
        return;
      }
   
     this.setStatus('Initiating transaction... (please wait)');
     
     console.log(" id: "+this.idStation+ " - "+ this.deposito);
     try {
       const deployedGasStation = await this.GasStation.deployed();
       //setStation(uint id,uint deposit)
       const setGasolineraTransaction = await deployedGasStation.setStation.sendTransaction(this.idStation, this.deposito,{from: this.model.account});
       if (!setGasolineraTransaction) {
         this.setStatus('Transaction failed!');
       } else {
         this.setStatus('Transaction complete!');
       }
     } catch (e) {
       console.log(e);
       this.setStatus('Error; see log.');
     }
   
   
  }
  

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
    
    });
  }

}
