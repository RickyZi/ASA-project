const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Light = require('./Light');
const Clock = require('../utils/Clock')


class SenseLightsGoal extends Goal {

    constructor (lights = []) {
        super()

        /** @type {Array<Light>} lights */
        this.lights = lights
    }

}



class SenseLightsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Light>} lights */
        this.lights = this.goal.lights
    }
    
    static applicable (goal) {
        return goal instanceof SenseLightsGoal
    }

    *exec () {
        var lightsGoals = []
        for (let l of this.lights) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)

            
            let lightGoalPromise = new Promise( async res => {
                while (true) {
                    // let status = await Clock.global.notifyChange('hh', 'on');

                    // if(status == 6 )
                    // // this.log('sense: light ' + l.name + ' switched ' + status)
                    // // this.agent.beliefs.declare('light_on '+l.name, status=='on')
                    // // this.agent.beliefs.declare('light_off '+l.name, status=='off')
                }

            });

            lightsGoals.push(lightGoalPromise)
        }
        yield Promise.all(lightsGoals)
    }
}

module.exports = {SenseLightsGoal, SenseLightsIntention}