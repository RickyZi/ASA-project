const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const Clock = require('../utils/Clock');
const Observable = require('../utils/Observable')

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
        // if(this.status == 'not_locked'){
        //     this.status = 'locked'
        //     console.log(this.name + ' locked')
        // }
        // console.log('entrance door already locked')
            
    }

    unlockDoor(){
        this.status = 'not_locked'
        console.log(this.name + ' not_locked')
    //    if(this.status == 'locked'){
    //         this.status = 'not_locked'
    //         console.log(this.name + ' unlocked')
    //     }
    //     console.log('entrance door already unlocked')
    }
}



module.exports = DoorLock