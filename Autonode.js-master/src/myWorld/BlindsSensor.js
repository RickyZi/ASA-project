const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const Blinds = require('./Blinds');

const Clock = require('../utils/Clock');

class SenseBlindsGoal extends Goal {

    constructor (blinds = []) {
        super()

        /** @type {Array<Blinds>} blinds */
        this.blinds = blinds

    }

}

class SenseBlindsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Blindt>} lights */
        this.blinds = this.goal.blinds
    }
    
    static applicable (goal) {
        return goal instanceof SenseBlindsGoal
    }
    *exec () {
        var blindsGoals = []
        for (let b of this.blinds) {
            let blindsGoalPromise = new Promise( async res => {
                while (true) {
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