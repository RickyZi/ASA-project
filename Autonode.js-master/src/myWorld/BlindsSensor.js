const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Blinds = require('./Blinds');

const Clock = require('../utils/Clock');

class SenseBlindsGoal extends Goal {

    constructor (blinds = []) {
        super()

        /** @type {Array<Blinds>} blinds */
        this.blinds = blinds

    }

}

// how to check if person in room and activate light in that room?

class SenseBlindsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Blindt>} lights */
        this.blinds = this.goal.blinds
    }
    
    static applicable (goal) {
        return goal instanceof SenseBlindsGoal
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
        var blindsGoals = []
        for (let b of this.blinds) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let blindsGoalPromise = new Promise( async res => {
                while (true) {
                    // let status = await Clock.global.notifyChange('hh', 'status'); //b.notifyChange('status')
                    // if(status == 23){
                    //     this.log('sense: blinds ' + b.name + ' ' + status)
                    //     this.agent.beliefs.declare('blinds_open '+b.name, status=='open')
                    //     this.agent.beliefs.declare('blinds_closed '+b.name, status=='close')
                    // }
                    let status = await b.notifyChange('status')
                    this.log('sense: blinds ' + b.name + ' ' + status)
                    this.agent.beliefs.declare('open '+b.name, status=='open')
                    this.agent.beliefs.declare('closed '+b.name, status=='closed')
                }
            });

            blindsGoals.push(blindsGoalPromise)
        }
        yield Promise.all(blindsGoals)
    }

}



class SenseOneBlindGoal extends Goal {

    constructor (blind) {
        super()

        /** @type {Light} light */
        this.blind = blind

    }

}



class SenseOneBlindIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Blind} light */
        this.blind = this.goal.blind
    }

    static applicable (goal) {
        return goal instanceof SenseOneBlindGoal
    }

    *exec () {
        while (true) {
            let status = yield this.blind.notifyChange('status')
            this.log('sense: ' + this.blind.name + ' ' + status)
            this.agent.beliefs.declare('blinds_open '+this.blind.name, status=='open')
            this.agent.beliefs.declare('blinds_closed '+this.blind.name, status=='close')
        }
    }

}



module.exports = {SenseBlindsGoal, SenseBlindsIntention, SenseOneBlindGoal, SenseOneBlindIntention}