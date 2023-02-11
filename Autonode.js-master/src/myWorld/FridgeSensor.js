const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const Fridge = require('./Fridge');


class SenseFridgeGoal extends Goal {

    constructor (fridge) {
        super()

        /** @type {Light} light */
        this.fridge = fridge

    }

}

class SenseFridgeIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Light} light */
        this.fridge = this.goal.fridge
    }

    static applicable (goal) {
        return goal instanceof SenseFridgeGoal
    }

    *exec () {
        while (true) {
            let status = yield this.fridge.notifyChange('status')
            this.log('sense:  fridge '  + status)

            this.agent.beliefs.declare('fridge_full ', status=='full')
            this.agent.beliefs.declare('fridge_half ', status=='half')
            this.agent.beliefs.declare('fridge_empty ', status=='empty')
        }
    }

}


module.exports = {SenseFridgeGoal, SenseFridgeIntention}