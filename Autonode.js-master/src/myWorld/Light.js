const Observable = require('../utils/Observable');



class Light extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // status: on, off
        this.electricityConsumption = 500; // 500Wh
    }
    switchOnLight () {
        if(this.status != 'on'){
            // console.log(this.name + ' already turned on')
            // return
            this.status = 'on'
            this.house.utilities.electricity.consumption += this.electricityConsumption;
            console.log(this.name + ' turned on')
        }
        
        
        
    }
    switchOffLight () {
        if(this.status != 'off'){
            this.status = 'off'
            this.house.utilities.electricity.consumption -=  this.electricityConsumption;
            console.log(this.name + ' turned off')
        }
        
        
    }
}


module.exports = Light