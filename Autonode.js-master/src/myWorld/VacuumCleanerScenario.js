// // def vacuum cleaner scenarion -> actions and goals

// // used online planner (directly saves domain and problem pddl files and send solving request to online planner)

const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')

const world = require('./WorldVacuumScenario')

/**
 * vacuum agent -> called the world methods
 * agent when it wants to perform an action it perform the method of a world, a method of a device, something external to the agent
 * sequence of actions computed by agent using online planner, combining the actions, finding the correct sequence of actions, with 
 * the correct parameters, to achieve goal
 * 
 * define agent intentions -> call to world methods and execute actions in the world, then update world and agent beliefs
 * 
 * implementation of the actions relies on a method provided by the world object
*/

// class VacuumAction{

//     // constructor (agent, parameters) {
//     //     this.agent = agent
//     //     this.parameters = parameters
//     // }

//     // get precondition () {
//     //     return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
//     // }
    
//     // checkPrecondition () {
//     //     return this.agent.beliefs.check(...this.precondition);
//     // }

//     // get effect () {
//     //     return pddlActionIntention.ground(this.constructor.effect, this.parameters)
//     // }

//     // applyEffect () {
//     //     for ( let b of this.effect )
//     //         this.agent.beliefs.apply(b)
//     // }

//     async checkPreconditionAndApplyEffect (duration) {
//         if ( this.checkPrecondition() ) {
//             this.applyEffect()
//             await new Promise(res=>setTimeout(res,duration))
//         }
//         else
//             throw new Error('pddl precondition not valid'); //Promise is rejected!
//     }
// }


class Move extends pddlActionIntention {
    static parameters = ['vacuum','source', 'destination'];
    static precondition = [['robot','vacuum'], ['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on' ,'vacuum'] ];
    static effect = [['at', 'vacuum','destination'],['not at', 'vacuum','source']];
    *exec ({source, destination}=parameters) {
        // this.log('move ', vacuum, source, destination)
        yield world.Move({vacuum: this.agent.name, source: source, destination: destination})
        // this.agent.device.Move(destination)
        // yield this.checkPreconditionAndApplyEffect(25)
    }
}

class CleanRoom extends pddlActionIntention {
    static parameters = ['vacuum','room'];
    static precondition = [ ['robot','vacuum'], ['room', 'room'],['dirty', 'room'],['at','vacuum', 'room'], ['on' ,'vacuum']];
    static effect = [['clean','room'], ['not dirty', 'room']];
    *exec ({room}=parameters) {
        yield world.CleanRoom({vacuum:  this.agent.name, room: room})
        // this.log('clean room', vacuum, room)
        
        // this.agent.device.CleanRoom(room);
        // yield this.checkPreconditionAndApplyEffect(50);
    }
}


class TurnOn extends pddlActionIntention {
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
    static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
    *exec ({}=parameters) {
        yield world.TurnOn({vacuum: this.agent.name})

        // this.agent.device.TurnOn()
        // yield this.checkPreconditionAndApplyEffect(1)
    }
}

class TurnOff extends pddlActionIntention {
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['on', 'vacuum'], ['discharging', 'vacuum']];
    static effect = [['off','vacuum'], ['not on', 'vacuum'], ['charging', 'vacuum'], ['not discharging', 'vacuum']];
    *exec ({}=parameters) {
        yield world.TurnOff({vacuum: this.agent.name})
        // this.log('clean room', vacuum, room)
        // yield this.checkPreconditionAndApplyEffect
        // this.agent.device.TurnOff()
        // yield this.checkPreconditionAndApplyEffect(1)
    }
}

class RetryGoal extends Goal {}
class RetryFourTimesIntention extends Intention { // replanning behaviour (agent tries up to 4 times to achieve goal)
    static applicable (goal) {
        return goal instanceof RetryGoal
    }
    *exec ({goal}=parameters) {
        for(let i=0; i<4; i++) {
            let goalAchieved = yield this.agent.postSubGoal( goal )
            if (goalAchieved)
                return;
            this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
            yield this.agent.beliefs.notifyAnyChange()
        }
    }
}

module.exports = {Move, CleanRoom, TurnOff, TurnOn, RetryGoal, RetryFourTimesIntention}

// -----------------------------------------------------------------------------------------------------------------------
// const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
// const Agent = require('../bdi/Agent')
// const Goal = require('../bdi/Goal')
// const Intention = require('../bdi/Intention')
// const PlanningGoal = require('../pddl/PlanningGoal')


// // from blocksworldScenario3.js

// // planning done at intention level not action level (design choice)

// class FakeAction extends pddlActionIntention {
//     // constructor (agent, parameters) {
//     //     this.agent = agent
//     //     this.parameters = parameters
//     // }

//     // get precondition () {
//     //     return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
//     // }
    
//     // checkPrecondition () {
//     //     return this.agent.beliefs.check(...this.precondition);
//     // }

//     // get effect () {
//     //     return pddlActionIntention.ground(this.constructor.effect, this.parameters)
//     // }

//     // applyEffect () {
//     //     for ( let b of this.effect )
//     //         this.agent.beliefs.apply(b)
//     // }
    
//     async checkPreconditionAndApplyEffect () {
//         if ( this.checkPrecondition() ) {
            
//             this.applyEffect() 
//             await new Promise(res=>setTimeout(res,100))
//         }
//         else
//             throw new Error('pddl precondition not valid'); //Promise is rejected!
//     }
// }

// // vacuum actions: move, clean, turnOn, turnOff

// class Move extends FakeAction{
//     // need to def parameters, preconditions, effects 
//     static parameters = ['v', 'source', 'destination'];
//     static precondition = [ ['robot', 'v'], ['room', 'source'], ['room', 'destination'], ['at', 'v', 'source'], ['connected', 'source', 'destination'], ['on', 'v'] ]; 
//     static effect = [ ['at', 'v', 'destination'], ['not at', 'v', 'source'] ];

//     // effect (predicate, arguments)

//     // simulate action exec
//     *exec ({v, source, destination}=parameters) {
//         // yield world.putDown({ob, gripper: this.agent.name})
//         // let duration = 20; // action takes some time to be exec
//         this.agent.device.move(destination); // added device in the agent definition to call action method
//         yield this.checkPreconditionAndApplyEffect();
//     }
// }

// class CleanRoom extends FakeAction{
//     static parameters = ['v', 'r'];
//     static precondition = [ ['robot', 'v'], ['room', 'r'], ['at', 'v','r'], ['empty', 'r'], ['on', 'v'] ];
//     static effect = [ ['clean', 'r']]; //, ['not dirty', 'r'] ];

//     *exec({v, r}=parameters){
//         // let duration = 200;
//         this.agent.device.cleanRoom(r);
//         yield this.checkPreconditionAndApplyEffect();
//     }
// }

// class TurnOn extends FakeAction{
//     static parameters = ['v'];
//     static precondition = [['robot', 'v'], ['off', 'v']]; //, ['charging', 'v']];
//     static effect = [['on', 'v'], ['not off', 'v']]; //, ['discharging', 'v'], ['not charging', 'v']];

//     *exec({v}=parameters){
//         // let duration = 5;
//         this.agent.device.turnOn();
//         yield this.checkPreconditionAndApplyEffect();
//     }
// }

// class TurnOff extends FakeAction{
//     static parameters = ['v'];
//     static precondition = [['robot', 'v'], ['on', 'v']]; //, ['discharging', 'v'] ];
//     static effect = [['off', 'v'], ['not on', 'v']]; //, ['charging', 'v'], ['not discharging', 'v']];

//     *exec({v}=parameters){
//         // let duration = 5;
//         this.agent.device.turnOff();
//         yield this.checkPreconditionAndApplyEffect();
//     }
// }

// class RetryGoal extends Goal {}
// class RetryFourTimesIntention extends Intention {
//     static applicable (goal) {
//         return goal instanceof RetryGoal
//     }
//     *exec ({goal}=parameters) {
//         for(let i=0; i<4; i++) {
//             let goalAchieved = yield this.agent.postSubGoal( goal )
//             if (goalAchieved)
//                 return;
//             this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
//             // yield this.agent.beliefs.notifyAnyChange()
//             yield this.agent.beliefs.notifyChange('empty '+ goal.parameters.goal[0].split(" ")[1]), this.log(goal.parameters.goal[0].split(" ")[1] + " is now empty, we can proceed to clean up")
//         }
//     }
// }

// module.exports = {Move, CleanRoom, TurnOn, TurnOff, RetryGoal, RetryFourTimesIntention}