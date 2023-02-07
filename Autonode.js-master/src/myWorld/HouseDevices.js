// put all devices here? to clean up a bit code

const Observable = require('../utils/Observable');

class Blinds extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'closed')   // status open, not_open
    }
    openBlinds () {
        this.status = 'open'
        //this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        //console.log('Kitchen light turned on')
        console.log(this.name + ' open')
    }
    closeBlinds () {
        this.status = 'closed'
        //this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(this.name + ' closed')
        //console.log('Kitchen light turned off')
    }
}

class DishWasher extends Observable {
    constructor (house, name) {
        super(house, name);
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable

        this.electricityConsumption = 1200; // dishwasher consumes 1200Wh per cleaning cycle

        /* dishwasher status: on, off */
    }

    turnOn(){
        if(this.status == 'off'){
            this.status = 'on';
            this.house.utilities.electricity.consumption += this.electricityConsumption;
        }
    }

    turnOff(){
        if(this.status == 'on'){// || this.status == 'pause'){
            this.status = 'off';
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
        }
    }
}

class DoorLock extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'locked')   //

        // door status: locked, not_locked

    }

    lockDoor(){
        this.status = 'locked'
        console.log(this.name + ' locked')
    }

    unlockDoor(){
        this.status = 'not_locked'
        console.log(this.name + ' not_locked')
    }
}

class Fridge extends Observable{

    /*
        Fridge:
        - possible status -> empty, full, half
        - actions -> set_empty, set_full, set_half

        (similar application for the washing machine
            status: on, off
            actions: turn_on, turn_off, ideally also remotely
            maybe send notification when finished running)
    */

    constructor(house, name){
        super()
        this.house = house;
        this.name = name;
        this.set('status', 'full') //status: empty, full, half
        this.electricityConsumption = 500; // fridge consumes an average of 500W
    }


    setEmpty(){
        this.status = 'empty'
        this.house.utilities.electricity.consumption += this.electricityConsumption;// always consume electricity
        console.log('fridge empty')
    }

    setFull(){
        this.status = 'full'
        this.house.utilities.electricity.consumption += this.electricityConsumption; // always consume electricity
        console.log('fridge full')
    }

    setHalf(){
        this.status = 'half'
        this.house.utilities.electricity.consumption += this.electricityConsumption; // always consume electricity
        console.log('fridge half full')
    }
    
}

class Heater extends Observable{

    constructor(house, name){
        super()
        this.house = house;
        this.name = name;
        this.set('status', 'off') // status: on, off
        this.electricityConsumption = 15; //10kWh each time heater turned on
    }

    switchOnHeater(){
        this.status = 'on'
        this.house.utilities.electricity.consumption += this.electricityConsumption;
        console.log(this.name + '  on')

    }

    switchOffHeater(){
        this.status = 'off'
        this.house.utilities.electricity.consumption -= this.electricityConsumption;
        console.log(this.name + ' off')
    }   
}

class Light extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // status: on, off
        this.electricityConsumption = 10; // 500Wh
    }
    switchOnLight () {
        if(this.status == 'on'){
            console.log(this.name + ' already turned on')
            return
        }
        this.status = 'on'
        this.house.utilities.electricity.consumption += this.electricityConsumption;
        // Include some messages logged on the console!
        //console.log('Kitchen light turned on')
        console.log(this.name + ' turned on')
        
        
    }
    switchOffLight () {
        if(this.status == 'off'){
            console.log(this.name + ' already turned off')
            return
        }
        this.status = 'off'
        this.house.utilities.electricity.consumption -=  this.electricityConsumption;
        console.log(this.name + ' turned off')
        
    }
}

class VacuumCleaner extends Observable{
    constructor(house, name, in_room){
        super(house, name)
        this.house = house;
        this.name = name;
        this.in_room = in_room;
        // this.status = "off"; // on, off 
        this.set('status', 'off')
        // this.battery = "charging"; // charging, discharging
        this.set('battery','charging')
    }

    //methods
    turnOn(){
        // if(this.status == 'off') && this.battery == 'charging'){
            this.status='on';
            console.log('turn on vacuum cleaner');
        // }
    }

    turnOff(){
        // if(this.status == 'on' )&& this.battery == 'discharging'){
            this.status = 'off';
            console.log('turn off vacuum cleaner');
        // }
    }
    
    move(to){
        console.log('vacuum moved from '+ this.in_room +' to '+ to);
        this.in_room=to;
    }

    cleanRoom(room){
        console.log('cleaning '+ room);
    }
}


class WashingMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         
        this.name = name;           
        this.set('status', 'off')
        this.electricityConsumption = 300; // 500 Wh/run
    }

    switchOnWashingMachine () {
        this.status = 'on'
        this.house.utilities.electricity.consumption += this.electricityConsumption;
        console.log('washing machine turned on')

        
        
    }
    switchOffWashingMachine () {
        this.status = 'off'
        this.house.utilities.electricity.consumption -= this.electricityConsumption;
        console.log('washing machine turned off')
    }
}

module.exports = {
    Blinds: Blinds,
    DishWasher: DishWasher,
    DoorLock: DoorLock,
    Fridge: Fridge,
    Heater: Heater,
    Light: Light,
    VacuumCleaner: VacuumCleaner,
    WashingMachine: WashingMachine
}