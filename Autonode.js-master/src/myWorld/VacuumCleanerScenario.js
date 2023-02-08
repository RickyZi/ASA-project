// def vacuum cleaner scenario -> actions and goals

// used online planner (directly saves domain and problem pddl files and send solving request to online planner)

const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')

/**
 * vacuum agent -> called the world methods
 * agent when it wants to perform an action it perform the method of a world, a method of a device, something external to the agent
 * sequence of actions computed by agent using online planner, combining the actions, finding the correct sequence of actions, with 
 * the correct parameters, to achieve goal
 * 
 * define agent intentions -> call to world methods and execute actions in the world, then update world and agent beliefs
 * 
 * implementation of the actions relies on a method provided by the world object
 * 
 * extended this idea, taken from blocksworldScenario3, to call the device methods instead of the world methods
*/

// need also to add the agent's device in the Agent.js constructor -> Agent(name, device) 
class VacuumAction extends pddlActionIntention{

    async checkPreconditionAndApplyEffect (duration) {
        if ( this.checkPrecondition() ) {
            this.applyEffect()
            await new Promise(res=>setTimeout(res,duration))
        }
        else
            throw new Error('pddl precondition not valid'); //Promise is rejected!
    }
}


class Move extends VacuumAction {
    static parameters = ['vacuum','source', 'destination'];
    static precondition = [['robot','vacuum'], ['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on' ,'vacuum'] ];
    static effect = [['at', 'vacuum','destination'],['not at', 'vacuum','source']];
    *exec ({source, destination}=parameters) {
        this.agent.device.move(destination)
        yield this.checkPreconditionAndApplyEffect(40)
    }
}

class CleanRoom extends VacuumAction {
    static parameters = ['vacuum','room'];
    static precondition = [ ['robot','vacuum'], ['room', 'room'],['dirty', 'room'],['at','vacuum', 'room'], ['on' ,'vacuum']];
    static effect = [['clean','room'], ['not dirty', 'room']];
    *exec ({room}=parameters) {
        this.agent.device.cleanRoom(room);
        yield this.checkPreconditionAndApplyEffect(90);
    }
}


class TurnOn extends VacuumAction {
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
    static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
    *exec ({}=parameters) {
        this.agent.device.turnOn()
        yield this.checkPreconditionAndApplyEffect(1)
    }
}

class TurnOff extends VacuumAction {
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['on', 'vacuum'], ['discharging', 'vacuum']];
    static effect = [['off','vacuum'], ['not on', 'vacuum'], ['charging', 'vacuum'], ['not discharging', 'vacuum']];
    *exec ({}=parameters) {
        this.agent.device.turnOff()
        yield this.checkPreconditionAndApplyEffect(1)
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