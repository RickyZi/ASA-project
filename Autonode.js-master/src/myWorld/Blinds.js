const Observable = require('../utils/Observable');

/*
    each room of the house has at least one automated blind

    status: open, closed
    actions: open, closed
*/


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



module.exports = Blinds