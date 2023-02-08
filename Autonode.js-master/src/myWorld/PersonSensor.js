const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
// const Person = require('./Person');

// to sense person intention and turn on/off lights when it enters a room

// NOTE: person (singular) and people (plural)


class SensePeopleGoal extends Goal {

    constructor (People = []) {
        super()

        /** @type {Array<Light>} lights */
        this.People = People
    }

}

// how to check if person in room and activate light in that room?

class SensePeopleIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Light>} lights */
        this.People = this.goal.People
    }
    
    static applicable (goal) {
        return goal instanceof SensePeopleGoal
    }
    
    *exec () {
        var PeopleGoals = []
        for (let p of this.People) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let PeopleGoalPromise = new Promise( async res => {
                while (true) {

                    let prev_room = p.in_room
                    let new_room  = await p.notifyChange('in_room')

                    
                    this.log('sense: person ' + p.name + ' moved to ' + new_room+ ' from ' + prev_room)

                    // num_ppl used to kepp track of how many people are in a room (in this case since there is only one resident it will be either 1 or 0)

                    if(new_room != prev_room && new_room != 'outdoor' && p.house.rooms[new_room].num_ppl > 0 && p.house.devices[new_room+'_light'].status == 'off'){
                        p.house.devices[new_room+'_light'].switchOnLight();
                    }

                    if(prev_room != 'outdoor' && p.house.rooms[prev_room].num_ppl == 0){
                        //console.log('person in room '+ prev_room + ': 0');
                        p.house.devices[prev_room+'_light'].switchOffLight();
                    }

                    // prev room should be already empty

                    this.agent.beliefs.declare('person_in_room ' +p.name + ' ' + new_room); // person_in_room bob bathroom
                    this.agent.beliefs.undeclare('empty '+ new_room);
                    if(prev_room != new_room){
                        this.agent.beliefs.undeclare('person_in_room ' +p.name + ' ' + prev_room); // person_in_room bob bathroom
                        this.agent.beliefs.declare('empty '+ prev_room);
                    }
                    
                }
            });

            PeopleGoals.push(PeopleGoalPromise)
        }
        yield Promise.all(PeopleGoals)
    }
}


module.exports = {SensePeopleGoal, SensePeopleIntention}