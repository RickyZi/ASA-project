const Observable =  require('../utils/Observable')
const Agent = require('../bdi/Agent')

class VacuumCleaner extends Observable{
    constructor(house, name, in_room){
        super(house, name);
        this.house = house;
        this.name = name;
        this.in_room = in_room;
        this.status = "off"; // on, off 
        this.battery = "charging"; // charging, discharging
    }

    //methods
    turnOn(){
        // if(this.status == 'off') {// && this.battery == 'charging'){
            this.status='on';
            this.battery = 'discharging';
            console.log('turn on vacuum cleaner');
        // }
    }

    turnOff(){
        // if(this.status == 'on'){ // && this.battery == 'discharging'){
            this.status = 'off';
            this.battery = 'charging'
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

module.exports = VacuumCleaner