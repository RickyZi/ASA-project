const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

// const DoorLock = require('./DoorLock');

const Clock = require('../utils/Clock');


class DoorLockGoal extends Goal {

    constructor (doorLock) {
        super()

        /** @type {DoorLock}  */
        this.doorLock = doorLock

    }

}

class DoorLockIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {DoorLock} light */
        this.doorLock = this.goal.doorLock
    }

    static applicable (goal) {
        return goal instanceof DoorLockGoal
    }

    *exec () {
        var doorLockGoals = [];
            let DoorLockGoalPromise = new Promise( async res => {
            while (true) {
                let status = await Clock.global.notifyChange('hh', 'locked')
                
                if(status == 23 && this.agent.beliefs.check('not locked entrance_door')){
                    // if at 23 door not locked -> lock front door
                    this.log("Entrance door locked! Good Night!")
                    this.doorLock.lockDoor()
                    
                }
                else if(status == 7 && this.agent.beliefs.check('not not_locked entrance_door')){
                    // if at 7 door locked -> unlock front door
                    this.log("Entrance door unlocked! Good Morning!")
                    this.doorLock.unlockDoor()
                   
                }
            }
        
        });
        doorLockGoals.push(DoorLockGoalPromise)
                
        yield Promise.all(doorLockGoals)
    }
}
module.exports = {DoorLockGoal, DoorLockIntention}