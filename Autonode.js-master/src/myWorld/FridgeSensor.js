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

            // house agent sends message to user (simulated using terminal) deppending on the status of the fridge
            if(status == 'empty'){
                console.log('firdge EMPTY! Need to buy groceries!') 
                this.agent.beliefs.declare('fridge_empty ', status=='empty')
            } 

            else if(status == 'half'){
                console.log('fridge HALF empty. Should buy groceries.')
                this.agent.beliefs.declare('fridge_half ', status=='half')
            } 
            else{
                console.log('fridge FULL. No need to buy groceries.')
                this.agent.beliefs.declare('fridge_full ', status=='full')
            }

           
            
            

            
        }
    }

}


module.exports = {SenseFridgeGoal, SenseFridgeIntention}