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
    //     while (true) {
    //         let status = yield this.doorLock.notifyChange('status');
    //         console.log(this.doorLock.name + ' ' + this.doorLock.status);
    //         this.agent.beliefs.declare('locked '+this.doorLock.name, status=='locked');
    //         this.agent.beliefs.declare('not_locked '+this.doorLock.name, status=='not_locked');
    //     }
    // }   
            // let status = yield Clock.global.notifyChange('hh', 'status')
            // if(status == 6 && this.agent.beliefs.check('not locked entrance_door')){
            //     this.log("it's 23, time to lock entrance door")
            //     this.doorLock.lockDoor();
            //     this.agent.beliefs.declare('door_close '+this.doorLock.name, status=='locked');
            //     this.agent.beliefs.declare('door_open '+this.doorLock.name, status=='not_locked');
            
            // }
        let DoorLockGoalPromise = new Promise( async res => {
            while (true) {
                // let status = await Clock.global.notifyChange('hh', 'locked')
                // if(status == 7 && this.agent.beliefs.check('not not_locked entrance_door')){
                //     // if at 7 door locked -> open the door
                //     this.log("It's time to unlock the entrance door!")
                //     this.doorLock.unlockDoor()
                //     this.agent.beliefs.declare('locked '+this.doorLock.name, status=='locked');
                //     this.agent.beliefs.declare('not_locked '+this.doorLock.name, status=='not_locked');
                // }
                
                // else if(status == 23 && this.agent.beliefs.check('not locked entrance_door')){
                //     // if at 23 door not locked -> close the door
                //     this.log("It's time to lock the entrance door!")
                //     this.doorLock.lockDoor()
                //     this.agent.beliefs.declare('locked '+this.doorLock.name, status=='locked');
                //     this.agent.beliefs.declare('not_locked '+this.doorLock.name, status=='not_locked');
                // }
                
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