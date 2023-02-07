const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
//const DishWasher = require('./DishWasher');


/*
    sensing status fridge and activate consequently 
*/

// there is only one fridge in the house and its is located in the kitchen (no need to name it)

class SenseDWGoal extends Goal {

    constructor (dw) { // dw = DishWasher
        super()

        /** @type {DishWasher} light */
        this.dw = dw
    }

}



class SenseDWIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {DishWasher} light */
        this.dw = this.goal.dw
    }

    static applicable (goal) {
        return goal instanceof SenseDWGoal
    }

    *exec () {
        while (true) {
            let status = yield this.dw.notifyChange('status')
            this.log('sense:  dish washer '  + status)
            this.agent.beliefs.declare('DW on ', status=='running')
            this.agent.beliefs.declare('DW off ', status=='off')
            this.agent.beliefs.declare('DW pause ', status=='pause')
        }
    }

}


module.exports = {SenseDWGoal, SenseDWIntention}