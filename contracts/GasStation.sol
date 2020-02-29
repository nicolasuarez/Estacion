pragma solidity ^0.5.0;
contract GasStation {
    enum TipoGas{Extra,Corriente}
   
    struct Vehicle{
        address payable direccion;
        uint id;
        TipoGas tipo;
        uint cantidadSolicitada;
        uint montoConsignado;
        bool creado;
    }
    struct Gas {
        TipoGas typeGas;
        uint price;
        uint cantidadDisponible;
        bool creado;
    }

    struct Station {
        address payable direccion;
        uint id;
        uint Deposit;
        Gas[] fuels; //combustibles ofrecidos en la estacion
        mapping (uint => Vehicle) vehicles; //estaciones
        bool creado;
    }

    mapping (uint => Station) stations; //estaciones
    mapping (uint => uint) saldoStacion; //saldo disponible para ser retirado por la gasolinera  
   
    event echo();
    event valor(uint val);
    event viewGasInfo(uint id, string typeGas, uint price);
    event error(string error);
    event consignacionRealizada(TipoGas tipo, uint cantidadSolicitada, uint monto);
    event entregaCombustible(uint Vehiculo,uint cantidadSolicitada);
   
    modifier estacionNoExiste(uint id){
        if(stations[id].creado){
            revert();
        }
        _;
    }
   
    //registro gas station
    function setStation(uint id,uint deposit) public {
        stations[id].direccion=msg.sender;
        stations[id].Deposit = deposit*1000000000000000000;
        stations[id].id=id;
        stations[id].creado=true;
    }
    //agregar gas a stacion
    function setStationFuel(uint id,TipoGas tipo, uint price, uint cantidadDisp) public {
        Gas memory gas = Gas(tipo, price*1000000000000000000,cantidadDisp,true);
        stations[id].fuels.push(gas);
    }
   
    //getGasInfo cantidad de Fuels
    function getStationGasInfo(uint idStation ) public view returns (uint,uint){
       uint lengthFuels=0;
        if(stations[idStation].creado==true){
          lengthFuels=stations[idStation].fuels.length;
        }
        return (stations[idStation].Deposit,lengthFuels);   
    }
    
    //get fuel
    function getGasInfo(uint idStation, uint idfuel) public view returns (TipoGas, uint,uint) {
        return (stations[idStation].fuels[idfuel].typeGas, stations[idStation].fuels[idfuel].price,stations[idStation].fuels[idfuel].cantidadDisponible);
    }

    //enviar deposito
    function sendDeposit(uint idStation, uint idVehiculo, TipoGas tipo,uint cantidadSolicitada ) public payable {
        if(stations[idStation].creado==false || msg.value<stations[idStation].Deposit){
            revert();
        }
        stations[idStation].vehicles[idVehiculo].direccion=msg.sender;
        stations[idStation].vehicles[idVehiculo]. cantidadSolicitada=cantidadSolicitada;
        stations[idStation].vehicles[idVehiculo].tipo=tipo;
        stations[idStation].vehicles[idVehiculo].montoConsignado=msg.value;
        stations[idStation].vehicles[idVehiculo].creado=true;
        emit consignacionRealizada(tipo, cantidadSolicitada, msg.value);
    }
    //verificar deposito
    function verificarDeposit(uint idStation, uint idVehiculo) public view returns (bool){
        return (stations[idStation].vehicles[idVehiculo].creado);
    }
    //enviar conbustible
    function sendFuel(uint _station,uint Vehiculo, uint fuel, uint cantidadSolicitada) public{
        //verificar deposito, montoconsignado>precio*cant ,  gas disponible
        /*&&
        stations[_station].vehicles[Vehiculo].montoConsignado> stations[_station].fuels[fuel].price*cantidadSolicitada &&
        stations[_station].fuels[fuel].cantidadDisponible> cantidadSolicitada*/
         emit echo();
        if(verificarDeposit(_station,Vehiculo)==true){
            emit echo();
            emit valor(stations[_station].fuels[fuel].price*cantidadSolicitada);
            stations[_station].direccion.transfer(stations[_station].fuels[fuel].price*cantidadSolicitada);
            emit valor(stations[_station].vehicles[Vehiculo].montoConsignado-(stations[_station].fuels[fuel].price*cantidadSolicitada));                        
           
            stations[_station].vehicles[Vehiculo].direccion.transfer(stations[_station].vehicles[Vehiculo].montoConsignado-(stations[_station].fuels[fuel].price*cantidadSolicitada));
            stations[_station].fuels[fuel].cantidadDisponible-=cantidadSolicitada;
            stations[_station].vehicles[Vehiculo].montoConsignado-=stations[_station].fuels[fuel].price*cantidadSolicitada;
           
            saldoStacion[_station]=stations[_station].fuels[fuel].price*cantidadSolicitada;//agregamos pago a estacion
            delete stations[_station].vehicles[Vehiculo];
            emit entregaCombustible(Vehiculo,cantidadSolicitada);
        }else {
            revert();
        }
    }

    function consultarSaldoEstacion(uint _station,uint Vehiculo) public view returns (uint){
        return (stations[_station].vehicles[Vehiculo].montoConsignado);
    }
   
    function SaldoEstacion(uint _station) public view returns (uint){
        return (saldoStacion[_station]);
    }
}