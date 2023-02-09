// house devices definition

const Observable = require('../utils/Observable');

class Blinds extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         
        this.name = name;           
        this.set('status', 'closed')   // status open, closed
    }
    openBlinds () {
        this.status = 'open'
        console.log(this.name + ' open')
    }
    closeBlinds () {
        this.status = 'closed'
        console.log(this.name + ' closed')
    }
}

class DishWasher extends Observable {
    constructor (house, name) {
        super(house, name);
        this.house = house;         
        this.name = name;           
        this.set('status', 'off')   // status: on, off

        this.electricityConsumption = 1200; // dishwasher consumes 1200Wh per cleaning cycle
    }

    turnOn(){
        if(this.status == 'off'){
            this.status = 'on';
            this.house.utilities.electricity.consumption += this.electricityConsumption;
        }
    }

    turnOff(){
        if(this.status == 'on'){
            this.status = 'off';
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
        }
    }
}

class DoorLock extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         
        this.name = name;           
        this.set('status', 'locked')   // door status: locked, not_locked

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
    constructor(house, name){
        super()
        this.house = house;
        this.name = name;
        this.set('status', 'full') //status: empty, full, half
        this.electricityConsumption = 500; // fridge always consumes an average of 500W
    }


    setEmpty(){
        this.status = 'empty'
        this.house.utilities.electricity.consumption += this.electricityConsumption;
        console.log('fridge empty')
    }

    setFull(){
        this.status = 'full'
        this.house.utilities.electricity.consumption += this.electricityConsumption; 
        console.log('fridge full')
    }

    setHalf(){
        this.status = 'half'
        this.house.utilities.electricity.consumption += this.electricityConsumption; 
        console.log('fridge half full')
    }
    
}

class Heater extends Observable{

    constructor(house, name){
        super()
        this.house = house;
        this.name = name;
        this.set('status', 'off') // status: on, off
        this.electricityConsumption = 15; //15kWh each time heater turned on
        this.set('temperature', 18)

        // turn_on/turn_off morning, afternoon, evening?

    }

    switchOnHeater(){
        if(this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += this.electricityConsumption;
            console.log(this.name + '  on', 'temperature',this.temperature)
        }
        
    }

    switchOffHeater(){
        if(this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
            console.log(this.name + ' off')
        }

        
    }   

    setNewTemperature(new_temperature){
        console.log(this.name,'temeperature changed from',this.temperature,'to', new_temperature)
        this.temperature = new_temperature;
    }
}

class Light extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         
        this.name = name;           
        this.set('status', 'off')   // status: on, off
        this.electricityConsumption = 10; // 10Wh every time light turned on
    }
    switchOnLight () {
        if(this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += this.electricityConsumption;
            console.log(this.name + ' turned on')
        }
    }
    switchOffLight () {
        if(this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -=  this.electricityConsumption;
            console.log(this.name + ' turned off')
        }
        
    }
}

class VacuumCleaner extends Observable{
    constructor(house,name, in_room){
        super()
        this.house = house;
        this.name = name;
        this.in_room = in_room;
        this.set('status','off'); // status: on, off
        this.set('battery', 'charging') // battery_status: charging, disharging
        this.electricityConsumption = 90; // 90W per scharging cycle
    }

    // turnOn and turnOff methods follows the preconditions of the PDDL methods

    turnOn(){
        if(this.status == 'off' && this.battery == 'charging'){ 
            this.status='on';
            this.battery = 'discharging';
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
            console.log('turn on vacuum cleaner');
        }
    }

    turnOff(){
        if(this.status == 'on' && this.battery == 'discharging'){
            this.status = 'off';
            this.battery = 'charging';
            this.house.utilities.electricity.consumption += this.electricityConsumption;
            console.log('turn off vacuum cleaner');
        }
    }
    
    move(to_room){
        console.log('vacuum moved from '+ this.in_room +' to '+ to_room);
        this.in_room=to_room;
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
        this.electricityConsumption = 300; // 300 Wh/run
    }

    switchOnWashingMachine () {
        if(this.status == 'off'){
            this.status = 'on'
            this.house.utilities.electricity.consumption += this.electricityConsumption;
            console.log('washing machine turned on')    
        }
        
    }

    switchOffWashingMachine () {
        if(this.status == 'on'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
            console.log('washing machine turned off')
        }
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