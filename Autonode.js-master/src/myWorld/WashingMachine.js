const Observable = require('../utils/Observable');



class WashingMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         
        this.name = name;           
        this.set('status', 'off')
        this.electricityConsumption = 500; // 500 Wh/run
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


module.exports = WashingMachine