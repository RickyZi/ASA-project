const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');

// const DoorLock = require('./DoorLock');

const Clock = require('../utils/Clock');


/*
    sensing status doors
    - status: open, closed
    - actions: open_door, close_door
*/

// every day at midnight close the entrance

class SenseDoorLockGoal extends Goal {

    constructor (doorLock) {
        super()

        /** @type {DoorLock}  */
        this.doorLock = doorLock

    }

}

class SenseDoorLockIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {DoorLock} light */
        this.doorLock = this.goal.doorLock
    }

    static applicable (goal) {
        return goal instanceof SenseDoorLockGoal
    }

    *exec () {
        var doorLockGoals = [];
        let DoorLockGoalPromise = new Promise( async res => {
            while (true) {
                let status = await this.doorLock.notifyChange('status');
                this.agent.beliefs.declare('locked '+ this.doorLock.name, status == 'locked');
                this.agent.beliefs.declare('not_locked '+ this.doorLock.name, status == 'not_locked');
            }
        
        });
        doorLockGoals.push(DoorLockGoalPromise)
                
        yield Promise.all(doorLockGoals)
    }
}
module.exports = {SenseDoorLockGoal, SenseDoorLockIntention}