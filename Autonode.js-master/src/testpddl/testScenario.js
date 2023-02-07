const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')



/**
 * World agent
 * world methos -> method that our device have
 */
// const world = new Agent('world');

const world = require('./world')

const {Move, CleanRoom, TurnOff, TurnOn, RetryFourTimesIntention, RetryGoal} = require('./vacuum')
const { VacuumCleaner } = require('../myWorld/HouseDevices')

// const {Move, CleanRoom, TurnOn, TurnOff} = require('./vacuumAgent')

// {
//     class FakeAction{

//         constructor (agent, parameters) {
//             this.agent = agent
//             this.parameters = parameters
//         }

//         get precondition () {
//             return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
//         }
        
//         checkPrecondition () {
//             return this.agent.beliefs.check(...this.precondition);
//         }

//         get effect () {
//             return pddlActionIntention.ground(this.constructor.effect, this.parameters)
//         }

//         applyEffect () {
//             for ( let b of this.effect )
//                 this.agent.beliefs.apply(b)
//         }

//         async checkPreconditionAndApplyEffect () {
//             if ( this.checkPrecondition() ) {
//                 this.applyEffect()
//                 await new Promise(res=>setTimeout(res,1000))
//             }
//             else
//                 throw new Error('pddl precondition not valid'); //Promise is rejected!
//         }
//     }

//     class Move extends FakeAction {
//         static parameters = ['vacuum', 'source', 'destination'];
//         static precondition = [['robot','vacuum'],['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on', 'vacuum']]
//         static effect = [['at','vacuum','destination'],['not at','vacuum','source']]
//     }

//     class CleanRoom extends FakeAction{
//         static parameters = ['vacuum', 'room'];
//         static precondition = [['robot','vacuum'],['room', 'room'],['dirty', 'room'],['at','vacuum','room'], ['on', 'vacuum']]
//         static effect = [['clean','room'],['not dirty','room']]
//     }

//     // test charging and discharging vacuum_agent batteries

//     class TurnOn extends FakeAction{
//         static parameters = ['vacuum'];
//         static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
//         static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
//     }

//     class TurnOff extends FakeAction{
//         static parameters = ['vacuum'];
//         static precondition = [ ['robot','vacuum'], ['on', 'vacuum'], ['discharging', 'vacuum']];
//         static effect = [['off','vacuum'], ['not on', 'vacuum'], ['charging', 'vacuum'], ['not discharging', 'vacuum']];
//     }
    
    
//     world.Move = function ({vacuum, source, destination} = args){
//         this.log('move ', vacuum,source,destination)
//         return new Move(world, {vacuum,source,destination}).checkPreconditionAndApplyEffect(50)
//         .catch(err => {this.error('world.Move failed:', err.message || err); throw err;})
//     }

//     world.CleanRoom = function ({vacuum, room} = args) {
//         this.log('clean room ', vacuum, room)
//         return new CleanRoom(world, {vacuum, room} ).checkPreconditionAndApplyEffect(100)
//         .catch(err=>{this.error('world.CleanRoom failed:', err.message || err); throw err;})
//     }

//     world.TurnOn = function({vacuum} = args){
//         this.log('turn on ', vacuum)
//         return new TurnOn(world, {vacuum}).checkPreconditionAndApplyEffect(1)
//         .catch(err => {this.error('world.TurnOn failed:', err.message || err); throw err;})
//     }
    
//     world.TurnOff = function({vacuum} = args){
//         this.log('turn off ', vacuum)
//         return new TurnOff(world, {vacuum}).checkPreconditionAndApplyEffect(1)
//         .catch(err => {this.error('world.TurnOff failed:', err.message || err); throw err;})
//     }

// }


/**
 * vacuum agent -> called the world methods
 * agent when it wants to perform an action it perform the method of a world, a method of a device, something external to the agent
 * sequence of actions computed by agent using online planner, combining the actions, finding the correct sequence of actions, with 
 * the correct parameters, to achieve goal
 */
// {
//     class Move extends pddlActionIntention {
//         static parameters = ['vacuum','source', 'destination'];
//         static precondition = [['robot','vacuum'], ['room', 'source'],['room', 'destination'],['at','vacuum','source'],['connected','source','destination'], ['on' ,'vacuum'] ];
//         static effect = [['at', 'vacuum','destination'],['not at', 'vacuum','source']];
//         *exec ({source, destination}=parameters) {
//             // this.log('move ', vacuum, source, destination)
//             yield world.Move({vacuum: this.agent.name, source: source, destination: destination})
//             // yield this.checkPreconditionAndApplyEffect()
//         }
//     }

//     class CleanRoom extends pddlActionIntention {
//         static parameters = ['vacuum','room'];
//         static precondition = [ ['robot','vacuum'], ['room', 'room'],['dirty', 'room'],['at','vacuum', 'room'], ['on' ,'vacuum']];
//         static effect = [['clean','room'], ['not dirty', 'room']];
//         *exec ({room}=parameters) {
//             // yield world.TurnOn({vacuum: this.agent.name})
//             yield world.CleanRoom({vacuum:  this.agent.name, room: room})
//             // this.log('clean room', vacuum, room)
//             // yield this.checkPreconditionAndApplyEffect
//         }
//     }


//     class TurnOn extends pddlActionIntention {
//         static parameters = ['vacuum'];
//         static precondition = [ ['robot','vacuum'], ['off', 'vacuum'] , ['charging', 'vacuum']];
//         static effect = [['on','vacuum'], ['not off', 'vacuum'], ['discharging', 'vacuum'], ['not charging', 'vacuum']];
//         *exec ({}=parameters) {
//             yield world.TurnOn({vacuum: this.agent.name})
//             // this.log('clean room', vacuum, room)
//             // yield this.checkPreconditionAndApplyEffect
//         }
//     }

//     class TurnOff extends pddlActionIntention {
//         static parameters = ['vacuum'];
//         static precondition = [ ['robot','vacuum'], ['on', 'vacuum'], ['discharging', 'vacuum']];
//         static effect = [['off','vacuum'], ['not on', 'vacuum'], ['charging', 'vacuum'], ['not discharging', 'vacuum']];
//         *exec ({}=parameters) {
//             yield world.TurnOff({vacuum: this.agent.name})
//             // this.log('clean room', vacuum, room)
//             // yield this.checkPreconditionAndApplyEffect
//         }
//     }

//     class RetryGoal extends Goal {}
//     class RetryFourTimesIntention extends Intention {
//         static applicable (goal) {
//             return goal instanceof RetryGoal
//         }
//         *exec ({goal}=parameters) {
//             for(let i=0; i<4; i++) {
//                 let goalAchieved = yield this.agent.postSubGoal( goal )
//                 if (goalAchieved)
//                     return;
//                 this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
//                 yield this.agent.beliefs.notifyAnyChange()
//             }
//         }
//     }

    

    //var sensor = (agent) => (value,key,observable) => {value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)}


{
    
    let a1 = new Agent('vacuum')

    //world.beliefs.observeAny( sensor(a1) )
    world.beliefs.observeAny((value,key,observable) => {value?a1.beliefs.declare(key):a1.beliefs.undeclare(key)})
    // world.beliefs.declare('empty room1')
    // world.beliefs.declare('empty room2')

    // let {PlanningIntention} = require('../pddl/BlackboxIntentionGenerator')([PickUp, PutDown, Stack, UnStack])


    
    let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, CleanRoom, TurnOn, TurnOff])
    a1.intentions.push(OnlinePlanning)
    a1.intentions.push(RetryFourTimesIntention)
    
    // console.log('a1 entries', a1.beliefs.entries)
    // console.log('a1 literals', a1.beliefs.literals)
    // a1.postSubGoal( new PlanningGoal( { goal: ['holding a'] } ) ) // by default give up after trying all intention to achieve the goal
    
    a1.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: 
        [
            ['clean entrance'],['clean living-room'], ['clean kitchen'], 
            ['clean hall'], ['clean bedroom'], ['clean bathroom'], 
            ['at vacuum entrance'], ['off vacuum']
        ] 
    } ) } ) ) // try to achieve the PlanningGoal for 4 times
}
    
    


// init world beliefs

// world = new world();

world.beliefs.declare('robot vacuum')

world.beliefs.declare('charging vacuum')

world.beliefs.declare('room entrance')
world.beliefs.declare('room living-room')
world.beliefs.declare('room kitchen')
world.beliefs.declare('room hall')
world.beliefs.declare('room bedroom')
world.beliefs.declare('room bathroom')

world.beliefs.declare('connected entrance living-room')
world.beliefs.declare('connected living-room entrance')

world.beliefs.declare('connected living-room kitchen')
world.beliefs.declare('connected kitchen living-room')

world.beliefs.declare('connected living-room hall')
world.beliefs.declare('connected hall living-room')

world.beliefs.declare('connected hall bedroom')
world.beliefs.declare('connected bedroom hall')

world.beliefs.declare('connected hall bathroom')
world.beliefs.declare('connected bathroom hall')

world.beliefs.declare('at vacuum entrance')
world.beliefs.declare('off vacuum')

world.beliefs.declare('dirty entrance')
world.beliefs.declare('dirty living-room')
world.beliefs.declare('dirty kitchen')
world.beliefs.declare('dirty hall')
world.beliefs.declare('dirty bedroom')
world.beliefs.declare('dirty bathroom')

