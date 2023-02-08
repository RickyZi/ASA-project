const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const Heater = require('./Heater');
const Clock = require('../utils/Clock');



class HeatersGoal extends Goal {

    constructor (heaters = []) {
        super()

        /** @type {Array<Heater>} lights */
        this.heaters = heaters

    }

}



class HeatersIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Heater>} heaters */
        this.heaters = this.goal.heaters
    }
    
    static applicable (goal) {
        return goal instanceof HeatersGoal
    }

    
    *exec () {
        var heatersGoals = []
            let heaterGoalPromise = new Promise( async res => {
                while (true) {
                    /**
                     * turn on heater -> 6, 12, 18
                     * turn off heater -> 7, 14, 22
                     */
                    //let h = this.heaters

                    let status = await Clock.global.notifyChange('hh', 'on');
                    for(let h of this.heaters){
                        if(status == 6){ // turn on heater bathroom, kitchen
                            if(h.name == 'kitchen_heater' || h.name == 'bathroom_heater' && this.agent.beliefs.check('not on ' + h.name)){
                                this.log('turned on '+ h.name);
                                h.switchOnHeater();
                            }
                        }

                        if(status == 7){
                            // turn off heater bathroom, kitchen
                            if(h.name == 'kitchen_heater' || h.name == 'bathroom_heater' && this.agent.beliefs.check('on ' + h.name)){
                                this.log('turned off '+ h.name);
                                h.switchOffHeater();
                            }
                        }

                        if(status == 13){
                            // turn on heater kitchen, living room
                            if(h.name == 'kitchen_heater' || h.name == 'living_room_heater'  && this.agent.beliefs.check('not on ' + h.name)){
                                this.log('turned on '+ h.name);
                                h.switchOnHeater();
                            }
                        }

                        if(status == 14){
                            // turn off heater kitchen, living room
                            if(h.name == 'kitchen_heater' || h.name == 'living_room_heater' && this.agent.beliefs.check('on ' + h.name)){
                                this.log('turned off '+ h.name);
                                h.switchOffHeater();
                            }
                        }

                        if(status == 19){
                            // turn on all the heaters
                            if(this.agent.beliefs.check('not on '+h.name)){
                                this.log('turned on '+h.name);
                                h.switchOnHeater();
                            }
                        }

                        if(status == 22){   
                            // turn off all the heaters
                            if(this.agent.beliefs.check('on '+h.name)){
                                this.log('turned off '+h.name);
                                h.switchOffHeater();
                            }
                        }
                    }
                }
            });

            heatersGoals.push(heaterGoalPromise)
        //}
        yield Promise.all(heatersGoals)
    }

}

module.exports = {HeatersGoal, HeatersIntention} //, SenseOneHeaterGoal, SenseOneHeaterIntention}