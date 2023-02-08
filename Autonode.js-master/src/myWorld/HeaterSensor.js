const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const Heater = require('./Heater');
const Clock = require('../utils/Clock');



class SenseHeatersGoal extends Goal {

    constructor (heaters = []) {
        super()

        /** @type {Array<Heater>} lights */
        this.heaters = heaters

    }

}



class SenseHeatersIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Heater>} heaters */
        this.heaters = this.goal.heaters
    }
    
    static applicable (goal) {
        return goal instanceof SenseHeatersGoal
    }

    *exec () {
        var heatersGoals = []
        for (let h of this.heaters) {
            let heaterGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await h.notifyChange('status')
                    this.log('sense: heater ' + h.name + ' switched ' + status)
                    this.agent.beliefs.declare('on '+h.name , status=='on')
                    this.agent.beliefs.declare('off '+h.name , status=='off')
                }
            });

            heatersGoals.push(heaterGoalPromise)
        }
        yield Promise.all(heatersGoals)
    }

}



class SenseOneHeaterGoal extends Goal {

    constructor (heater) {
        super()

        /** @type {Thermostat} thermostat */
        this.heater = heater

    }

}



class SenseOneHeaterIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Thermostat} thermostat */
        this.heater = this.goal.heater
    }

    static applicable (goal) {
        return goal instanceof SenseOneThermostatGoal
    }

    *exec () {
        while (true) {
            let status = yield this.heater.notifyChange('status')
            this.log('sense: heater ' + this.heater.name + ' switched ' + status)
            this.agent.beliefs.declare('heater_on '+this.heater.name, status=='on')
            this.agent.beliefs.declare('heater_off '+this.heater.name, status=='off')
        }
    }

}



module.exports = {SenseHeatersGoal, SenseHeatersIntention, SenseOneHeaterGoal, SenseOneHeaterIntention}