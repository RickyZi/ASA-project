const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const WashingMachine = require('./WashingMachine');


class SenseWMGoal extends Goal {

    constructor (wm) { // wm = washing machine
        super()

        /** @type {WashingMachine} light */
        this.wm = wm

    }

}

class SenseWMIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {WashingMachine} light */
        this.wm = this.goal.wm
    }

    static applicable (goal) {
        return goal instanceof SenseWMGoal
    }

    *exec () {
        while (true) {
            let status = yield this.wm.notifyChange('status')
            this.log('sense:  washing machine '  + status)
            this.agent.beliefs.declare('on WM', status=='on')
            this.agent.beliefs.declare('off WM', status=='off')
        }
    }

}


module.exports = {SenseWMGoal, SenseWMIntention}