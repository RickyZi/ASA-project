const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')


/**
 * World agent
 * world methos -> method that our device have
 * vacuum agent acts in the world, in this case the house domain which is represented by the knowledge base of the world agent
 */

class MyAction{

    constructor (agent, parameters) {
        this.agent = agent
        this.parameters = parameters
    }

    get precondition () {
        return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
    }
    
    checkPrecondition () {
        return this.agent.beliefs.check(...this.precondition);
    }

    get effect () {
        return pddlActionIntention.ground(this.constructor.effect, this.parameters)
    }

    applyEffect () {
        for ( let b of this.effect )
            this.agent.beliefs.apply(b)
    }

    async checkPreconditionAndApplyEffect (duration) {
        if ( this.checkPrecondition() ) {
            this.applyEffect()
            await new Promise(res=>setTimeout(res,duration))
        }
        else
            throw new Error('pddl precondition not valid'); //Promise is rejected!
    }
}

class Move extends MyAction {
    static parameters = ['vacuum', 'source', 'destination'];
    static precondition = [ ['robot','vacuum'], ['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on', 'vacuum']]
    static effect = [['at','vacuum','destination'],['not at','vacuum','source']]
}

class CleanRoom extends MyAction{
    static parameters = ['vacuum', 'room'];
    static precondition = [['robot','vacuum'],['room', 'room'],['dirty', 'room'],['at','vacuum','room'], ['on', 'vacuum']]
    static effect = [['clean','room'],['not dirty','room']]
}

// test charging and discharging vacuum_agent batteries

class TurnOn extends MyAction{
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
    static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
}

class TurnOff extends MyAction{
    static parameters = ['vacuum'];
    static precondition = [ ['robot','vacuum'], ['on', 'vacuum'], ['discharging', 'vacuum']];
    static effect = [['off','vacuum'], ['not on', 'vacuum'], ['charging', 'vacuum'], ['not discharging', 'vacuum']];
}

const world = new Agent('world');

/**
 * agent beliefset used to represent the real status of the world
 */

world.Move = function ({vacuum, source, destination} = args){
    this.log('move ', vacuum,source,destination)
    return new Move(world, {vacuum,source,destination}).checkPreconditionAndApplyEffect(45)
    .catch(err => {this.error('world.Move failed:', err.message || err); throw err;})
}

world.CleanRoom = function ({vacuum, room} = args) {
    this.log('clean room ', vacuum, room)
    return new CleanRoom(world, {vacuum, room} ).checkPreconditionAndApplyEffect(90)
    .catch(err=>{this.error('world.CleanRoom failed:', err.message || err); throw err;})
}

world.TurnOn = function({vacuum} = args){
    this.log('turn on ', vacuum)
    return new TurnOn(world, {vacuum}).checkPreconditionAndApplyEffect(1)
    .catch(err => {this.error('world.TurnOn failed:', err.message || err); throw err;})
}

world.TurnOff = function({vacuum} = args){
    this.log('turn off ', vacuum)
    return new TurnOff(world, {vacuum}).checkPreconditionAndApplyEffect(1)
    .catch(err => {this.error('world.TurnOff failed:', err.message || err); throw err;})
}

module.exports = world