const Observable = require('../utils/Observable');


class DishWasher extends Observable {
    constructor (house, name) {
        super(house, name);
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable

        this.electricityConsumption = 1000 // dishwasher consumes 1000Wh

        /* dishwasher status: on, off, running, pause */
    }

    turnOn(){
        if(this.status == 'off'){
            this.status = 'running';
            this.house.utilities.electricity.consumption += this.electricityConsumption;
        }
    }

    turnOff(){
        if(this.status == 'running' || this.status == 'pause'){
            this.status = 'off';
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
        }
    }

    pause(){
        if(this.status == 'running'){
            this.status = 'pause';
            this.house.utilities.electricity.consumption -= this.electricityConsumption;
        }
    }

    resume(){
        if(this.status == 'pause'){
            this.status = 'running';
            this.house.utilities.electricity.consumption += this.electricityConsumption;
        }
    }
}


module.exports = DishWasher