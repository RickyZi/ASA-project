const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')

const world = require('./world')




class Move extends pddlActionIntention {
    static parameters = ['vacuum','source', 'destination'];
    static precondition = [['robot','vacuum'], ['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on' ,'vacuum'] ];
    static effect = [['at', 'vacuum','destination'],['not at', 'vacuum','source']];
    *exec ({source, destination}=parameters) {
        // this.log('move ', vacuum, source, destination)
        yield world.Move({vacuum: this.agent.name, source: source, destination: destination})
        // yield this.checkPreconditionAndApplyEffect()
    }
}

class CleanRoom extends pddlActionIntention {
    static parameters = ['vacuum','room'];
    static precondition = [ ['robot','vacuum'], ['room', 'room'],['dirty', 'room'],['at','vacuum', 'room'], ['on' ,'vacuum']];
    static effect = [['clean','room'], ['not dirty', 'room']];
    *exec ({room}=parameters) {
        // yield world.TurnOn({vacuum: this.agent.name})
        yield world.CleanRoom({vacuum:  this.agent.name, room: room})
        // this.log('clean room', vacuum, room)
        // yield this.checkPreconditionAndApplyEffect
    }
}


class TurnOn extends pddlActionIntention {
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
    static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
    *exec ({}=parameters) {
        yield world.TurnOn({vacuum: this.agent.name})
        // this.log('clean room', vacuum, room)
        // yield this.checkPreconditionAndApplyEffect
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
    }
}

class RetryGoal extends Goal {}
class RetryFourTimesIntention extends Intention {
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