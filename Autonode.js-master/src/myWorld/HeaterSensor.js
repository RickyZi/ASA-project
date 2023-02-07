const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Heater = require('./Heater');
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

    /**
     * To run code in parallel use postSubGoal without wait or yield. For example:
     * 
     * for (let l of this.lights) {
     *      let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
     *      lightsGoals.push(lightGoalPromise)
     * }
     * Or put paraller code in Promises callback and do not wait or yield for them neither. For example:
     * 
     * for (let l of this.lights) {
     *      let lightGoalPromise = new Promise( async res => {
     *          while (true) {
     *              let status = await l.notifyChange('status')
     *              this.log('sense: light ' + l.name + ' switched ' + status)
     *              this.agent.beliefs.declare('light_on '+l.name, status=='on')
     *              this.agent.beliefs.declare('light_off '+l.name, status=='off')
     *          }
     *      });
     * }
     */
    *exec () {
        var heatersGoals = []
        for (let h of this.heaters) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let heaterGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await h.notifyChange('status')
                    this.log('sense: heater ' + h.name + ' switched ' + status)
                    this.agent.beliefs.declare('on '+h.name , status=='on')
                    this.agent.beliefs.declare('off '+h.name , status=='off')

                    // let status = await
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