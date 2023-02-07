const Observable = require("../utils/Observable");

/* 
    there are diff heater in the house
    status: on, off
    actions: turn_on, turn_off

    controlled by house agent that turn them on/off 
    as defined by the resident
*/

class Heater extends Observable{

    constructor(house, name){
        super()
        this.house = house;
        this.name = name;
        this.set('status', 'off') // status: on, off
    }

    switchOnHeater(){
        this.status = 'on'
        this.house.utilities.electricity.consumption += 1;
        console.log(this.name + '  on')

    }

    switchOffHeater(){
        this.status = 'off'
        this.house.utilities.electricity.consumption -= 1;
        console.log(this.name + ' off')
    }   
}

module.exports = Heater