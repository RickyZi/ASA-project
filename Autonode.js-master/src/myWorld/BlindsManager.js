const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Blinds = require('./Blinds');

const Clock = require('../utils/Clock');

class BlindsGoal extends Goal {

    constructor (blinds = []) {
        super()

        /** @type {Array<Blinds>} blinds */
        this.blinds = blinds

    }

}

// how to check if person in room and activate light in that room?

class BlindsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Blindt>} lights */
        this.blinds = this.goal.blinds
    }
    
    static applicable (goal) {
        return goal instanceof BlindsGoal
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
        //for (let b of this.blinds) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let blindsGoalPromise = new Promise( async res => {
            while (true) {
                let status = await Clock.global.notifyChange('hh', 'closed'); 
                
                // close blinds at night
                if(status == 23  && this.agent.beliefs.check('not closed '+this.blinds.name)){
                    
                    for(let b of this.blinds){
                        this.log('Good Night! ' + b.name + ' closed');
                        b.closeBlinds();
                    }
                    
                }

                // open blinds in the morning when the alarm rings
                else if(status == 6 && this.agent.beliefs.check('not open ' +this.blinds.name)){
                    for(let b of this.blinds){
                        this.log('Good morning! '+b.name + ' opened');
                        b.openBlinds();
                    }
                }
                
            }
        });

        blindsGoals.push(blindsGoalPromise)
       // }
        yield Promise.all(blindsGoals)
    }

}

module.exports = {BlindsGoal, BlindsIntention}