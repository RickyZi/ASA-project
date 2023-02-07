const Observable = require("../utils/Observable");

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
        this.set('status', 'full')
        //status: empty, full, half
        this.electricityConsumption = 100;
    }


    setEmpty(){
        this.status = 'empty'
        this.house.utilities.electricity.consumption += this.electricityConsumption; // always consume electricity
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

module.exports = Fridge