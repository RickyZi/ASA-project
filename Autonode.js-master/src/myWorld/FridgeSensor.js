const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Fridge = require('./Fridge');


/*
    sensing status fridge and activate consequently 
*/

// there is only one fridge in the house and its is located in the kitchen (no need to name it)

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
            this.log('sense:  fridge_'  + status)

            // if(this.fridge.status == 'empty'){ // if fridge empty -> need to buy grocieries and also to start washing machine
            //     this.agent.beliefs.declare('fridge_empty ', status=='empty')   
            //     this.fridge.house.devices.washing_machine.switchOnWashingMachine()
            //     // fridge tell wm to turn on
            // }
            // else{
            //     this.agent.beliefs.declare('fridge_full ', status=='full')
            //     this.agent.beliefs.declare('fridge_half ', status=='half')
            //     // this.agent.beliefs.declare('fridge_empty ', status=='empty')
            // }


            this.agent.beliefs.declare('fridge_full ', status=='full')
            this.agent.beliefs.declare('fridge_half ', status=='half')
            this.agent.beliefs.declare('fridge_empty ', status=='empty')
            //this.agent.beliefs.declare('fridge_'+status);
        }
    }

}


module.exports = {SenseFridgeGoal, SenseFridgeIntention}