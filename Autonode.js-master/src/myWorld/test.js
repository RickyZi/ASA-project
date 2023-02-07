const Beliefset =  require('../bdi/Beliefset')
const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')

const House = require('./House')

const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
// const Agent = require('../bdi/Agent')
// const Goal = require('../bdi/Goal')
// const Intention = require('../bdi/Intention')
// const PlanningGoal = require('../pddl/PlanningGoal')

// const Person = require('./Person')
// const Light = require('./Light')

// -----------------------------------------------------------------------------------------------------------------------
// Device intentions

const {AlarmGoal, AlarmIntention} = require('./Alarm')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('./LightSensor')
const { SenseHeatersGoal, SenseHeatersIntention, SenseOneHeaterGoal, SenseOneHeaterIntention } = require('./HeaterSensor')
const {HeatersGoal, HeatersIntention} = require('./HeatersManager')
const { SenseFridgeIntention, SenseFridgeGoal } = require('./FridgeSensor')
const { SenseDoorLockGoal, SenseDoorLockIntention } = require('./DoorLockSensor')
const {DoorLockGoal, DoorLockIntention} = require('./DoorLockManager')
const { SensePeopleIntention, SensePeopleGoal } = require('./PersonSensor')
const {SenseWMGoal, SenseWMIntention} = require('./WashingMachineSensor')
const {SenseDWIntention, SenseDWGoal} = require('./DishWasherSensor')
const {SenseBlindsGoal, SenseBlindsIntention, SenseOneBlindGoal, SenseOneBlindIntention} = require('./BlindsSensor')
const {BlindsGoal, BlindsIntention} = require('./BlindsManager')

// ----------------------------------------------------------------------
// pddl actions
const{Move, CleanRoom, TurnOn, TurnOff, RetryGoal, RetryFourTimesIntention} = require('./VacuumAgentScenario')
const PlanningGoal = require('../pddl/PlanningGoal')
const world = require('./VacuumAgentWorld')
// ----------------------------------------------------------------------


// ---------------- House (includes rooms and devices definition) ----------------

var myHouse = new House()

// ----------------------------------------------------------------------

// ---------------- Agents ----------------

// ----------------------------------------------------------------------

// ---------------- House Agent ----------------
/*
    tasks:
    - turn on/off light when resident walks in/out of a room to reduce electricity consumption
    - lock main entrance door at night
    - close bedroom blinds at 22
    - turn on/off thermostats depending on user preference (fixed schedule)
    - close all windows at night
*/

var house_agent = new Agent('house_agent')
var security_agent = new Agent('security_agent');

// --------------- House Agent ---------------

house_agent.intentions.push(AlarmIntention)
house_agent.postSubGoal( new AlarmGoal({hh:6, mm:0}) )

house_agent.intentions.push(SensePeopleIntention)
house_agent.postSubGoal(new SensePeopleGoal([myHouse.people.bob]))

house_agent.intentions.push(SenseLightsIntention)
house_agent.postSubGoal( new SenseLightsGoal( [
    myHouse.devices.kitchen_light, 
    myHouse.devices.living_room_light, 
    myHouse.devices.bedroom_light, 
    myHouse.devices.bathroom_light,
    myHouse.devices.hall_light
]))

house_agent.intentions.push(SenseHeatersIntention)
house_agent.postSubGoal( new SenseHeatersGoal([
    myHouse.devices.kitchen_heater, 
    myHouse.devices.living_room_heater, 
    myHouse.devices.bedroom_heater, 
    myHouse.devices.bathroom_heater
]))

house_agent.intentions.push(HeatersIntention)
house_agent.postSubGoal(new HeatersGoal([
    myHouse.devices.kitchen_heater, 
    myHouse.devices.living_room_heater, 
    myHouse.devices.bedroom_heater, 
    myHouse.devices.bathroom_heater
]))

house_agent.intentions.push(SenseFridgeIntention)
house_agent.postSubGoal(new SenseFridgeGoal(myHouse.devices.fridge))

// house_agent.intentions.push(SenseDoorLockIntention)
// house_agent.postSubGoal(new SenseDoorLockGoal(myHouse.devices.entrance_door))


house_agent.intentions.push(SenseWMIntention);
house_agent.postSubGoal(new SenseWMGoal(myHouse.devices.washing_machine))

house_agent.intentions.push(SenseDWIntention)
house_agent.postSubGoal(new SenseDWGoal(myHouse.devices.dish_washer))

house_agent.intentions.push(SenseBlindsIntention)
house_agent.postSubGoal(new SenseBlindsGoal([myHouse.devices.bedroom_blinds, 
    myHouse.devices.bathroom_blinds, myHouse.devices.kitchen_blinds, 
    myHouse.devices.living_room_blinds]))


// ----------------------------------------------------------------------

// ---------------- Security Agent ----------------

/**
 * close entrance door at night
 * close all blinds at night
 */

security_agent.intentions.push(SenseDoorLockIntention)
security_agent.postSubGoal(new SenseDoorLockGoal(myHouse.devices.entrance_door))

security_agent.intentions.push(DoorLockIntention)
security_agent.postSubGoal(new DoorLockGoal(myHouse.devices.entrance_door))

security_agent.intentions.push(BlindsIntention)
security_agent.postSubGoal(new BlindsGoal([myHouse.devices.bedroom_blinds, myHouse.devices.bathroom_blinds, myHouse.devices.kitchen_blinds, myHouse.devices.living_room_blinds]))

// ----------------------------------------------------------------------

// ---------------- Vacuum Agent ----------------

// vacuum agent version where we directly access its methods
// var vacuum_agent = new Agent('vacuum_cleaner', myHouse.devices.vacuum_cleaner);

var vacuum_agent = new Agent('vacuum');

// call online planner
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, CleanRoom, TurnOn, TurnOff]) //, TurnOn, TurnOff, RetryFourTimesIntention])

vacuum_agent.intentions.push(OnlinePlanning)
vacuum_agent.intentions.push(RetryFourTimesIntention)

// world.beliefs.observeAny(sensor(vacuum_agent))
world.beliefs.observeAny((value,key,observable) => {value?vacuum_agent.beliefs.declare(key):vacuum_agent.beliefs.undeclare(key)})

// if we access directly the vacuum_cleaner methods:

// var sensor = (agent) => (value,key,observable) => {
//     let predicate = key.split(' ')[0]
//     let arg1 = key.split(' ')[1]
//     // let arg2 = key.split(' ')[2]
//     if (predicate=='dirty')
//         // if (arg2==agent.name)
//             key = 'dirty '+arg1; //+arg1; //key.split(' ').slice(0,2).join(' ')
//     else
//         return;

//     value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
// }

// house_agent.beliefs.observeAny(sensor(vacuum_agent))

// world.beliefs.observeAny(sensor(vacuum_agent))

function init_vacuum_belief(){

    // robot declaration
    // vacuum_agent.beliefs.declare('robot vacuum')

    // // room definition
    // vacuum_agent.beliefs.declare('room entrance')
    // vacuum_agent.beliefs.declare('room living-room')
    // vacuum_agent.beliefs.declare('room kitchen')
    // vacuum_agent.beliefs.declare('room hall')
    // vacuum_agent.beliefs.declare('room bathroom')
    // vacuum_agent.beliefs.declare('room bedroom')

    // // house structure definition
    // vacuum_agent.beliefs.declare('connected entrance living-room')
    // vacuum_agent.beliefs.declare('connected living-room entrance')

    // vacuum_agent.beliefs.declare('connected living-room kitchen')
    // vacuum_agent.beliefs.declare('connected kitchen living-room')
    
    // vacuum_agent.beliefs.declare('connected living-room hall')
    // vacuum_agent.beliefs.declare('connected hall living-room')

    // vacuum_agent.beliefs.declare('connected hall bathroom')
    // vacuum_agent.beliefs.declare('connected bathroom hall')

    // vacuum_agent.beliefs.declare('connected hall bedroom')
    // vacuum_agent.beliefs.declare('connected bedroom hall')
    
    // // def init location vacuum
    // vacuum_agent.beliefs.declare('at vacuum entrance')

    // //robot initially off
    // vacuum_agent.beliefs.declare('off vacuum')

    // robot is charging at the base station located in the entrance
    // vacuum_agent.beliefs.declare('charging vacuum') 

    // -------------------------------------------------------
    // world agent version

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
}

init_vacuum_belief()

function declare_dirty_rooms(){
    house_agent.beliefs.declare('dirty entrance')
    house_agent.beliefs.declare('dirty living-room')
    house_agent.beliefs.declare('dirty kitchen')
    house_agent.beliefs.declare('dirty hall')
    house_agent.beliefs.declare('dirty bathroom')
    house_agent.beliefs.declare('dirty bedroom')
    
    // world agent version

    world.beliefs.declare('dirty entrance')
    world.beliefs.declare('dirty living-room')
    world.beliefs.declare('dirty kitchen')
    world.beliefs.declare('dirty hall')
    world.beliefs.declare('dirty bedroom')
    world.beliefs.declare('dirty bathroom')
}


// ----------------------------------------------------------------------


Clock.global.observe('mm', (mm) => {
    var time = Clock.global

    // Bob wakes up at 6

    if(time.hh==6 && time.mm==5){
        myHouse.people.bob.moveTo('hall')
        // myHouse.devices.bedroom_window.openWindow()
    }
    if(time.hh==6 && time.mm==10){
        // myHouse.devices.bedroom_window.closeWindow()
        myHouse.people.bob.moveTo('bathroom')
    }
    if(time.hh==6 && time.mm==15){
        myHouse.people.bob.moveTo('hall')
    }
        
    if(time.hh==6 && time.mm==20){
        myHouse.people.bob.moveTo('living_room')
    }
    
    // brekfast scenario
    if(time.hh==6 && time.mm==25){
        myHouse.people.bob.moveTo('kitchen')
        myHouse.devices.fridge.setHalf()
    }
    
    if(time.hh == 6 && time.mm == 45){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 6 && time.mm==50){
        myHouse.people.bob.moveTo('entrance')
    }
        
    if(time.hh==7 && time.mm==0){
        myHouse.people.bob.moveTo('outdoor')
        //declare_empty_rooms()
    }
    if(time.hh == 7 && time.mm == 5){
        myHouse.devices.entrance_door.lockDoor() // Bob lock entance door
    }

    // ----------------------------------------------------------------------
    
    // Bob comes back home for lunch
    
    // lunch scenario 

    if(time.hh==13 && time.mm==00){
        myHouse.people.bob.moveTo('entrance')
        myHouse.devices.entrance_door.unlockDoor()
        // myHouse.devices.entrance_light.switchOnLight()
        
            
        // myHouse.devices.kitchen_heater.switchOnHeater()
        //myHouse.devices.fridge.setEmpty()
    }
    if(time.hh == 13 && time.mm == 5){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 13 && time.mm == 10){
        myHouse.people.bob.moveTo('kitchen')
        // myHouse.devices.kitchen_light.switchOnLight()
        myHouse.devices.fridge.setEmpty()
    }
    
    if(time.hh == 14 && time.mm == 20){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 14 && time.mm == 25){
        myHouse.people.bob.moveTo('entrance')
        // myHouse.devices.entrance_light.switchOnLight()
        
    }

    if(time.hh==14 && time.mm==30){
        // myHouse.devices.entrance_light.switchOffLight()
        myHouse.devices.entrance_door.lockDoor() // Bob locks the door
        myHouse.people.bob.moveTo('outdoor') // bob leaves again for work
        //declare_dirty_rooms()
        // vacuum_agent.beliefs.declare('dirty entrance')    
    }

    if(time.hh == 14 && time.mm == 35){
        declare_dirty_rooms() // house is empty so vacuum agent can clear all rooms 
    }
    
    // ----------------------------------------------------------------------
    // start vacuum agent

    // takes almsot 3 hours to clean the whole room
    // runs once per week to reduce electricity consumption

    if(time.hh == 15 && time.mm == 0){
        // vacuum agent starts when there's no one at home, all the rooms are declared as dirty since the resident used them
        vacuum_agent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: [
                    ['clean entrance'],['clean living-room'], ['clean kitchen'], 
                    ['clean hall'], ['clean bedroom'], ['clean bathroom'], ['at vacuum entrance'],
                    ['off', 'vacuum']
                ]} ) } ) )
    }

    // ----------------------------------------------------------------------

    // Bob finish working and comes back home
    // dinner scenario

    if(time.hh==19 && time.mm==0){
        myHouse.devices.entrance_door.unlockDoor() //bob unlocks door
        myHouse.people.bob.moveTo('entrance')
    }
        
    if(time.hh==19 && time.mm==5){
        myHouse.people.bob.moveTo('living_room')
    }
        
    if(time.hh==19 && time.mm==10){
        myHouse.people.bob.moveTo('hall')
    }
        
    if(time.hh==19 && time.mm==15){
        myHouse.people.bob.moveTo('bathroom')
        myHouse.devices.washing_machine.switchOnWashingMachine()
    }
        
    if(time.hh==19 && time.mm==20){
        myHouse.people.bob.moveTo('hall')
    }
        
    if(time.hh==19 && time.mm==25){
        myHouse.people.bob.moveTo('living_room')
    }
        

    if(time.hh==19 && time.mm==30){
        myHouse.people.bob.moveTo('kitchen') // dinner scenario
        myHouse.devices.fridge.setFull()
        myHouse.devices.dish_washer.turnOn()
    }
       

    if(time.hh==20 && time.mm==15){
        myHouse.people.bob.moveTo('living_room')
    }
        

    if(time.hh==22 && time.mm==0){
        myHouse.people.bob.moveTo('hall')
    }
        
    if(time.hh==22 && time.mm==5){
        myHouse.people.bob.moveTo('bathroom')
        myHouse.devices.washing_machine.switchOffWashingMachine()
    }
        

    if(time.hh==22 && time.mm==25){
        myHouse.people.bob.moveTo('hall')
        myHouse.devices.dish_washer.turnOff()

    }
        
    // turn off heaters
    if(time.hh==22 && time.mm==30){
        myHouse.people.bob.moveTo('bedroom')
        
    }
    
    if(time.hh == 23 && time.mm == 0){
        myHouse.devices.bedroom_light.switchOffLight()
    }
    
    // ----------------------------------------------------------------------

    // vacuum cleaner called once per week to save electricity consumption
    // if(time.dd == 3 && time.hh == 15 && time.mm == 0){
    //     declare_dirty_rooms()
    //     vacuum_agent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: 
    //         [
    //             ['clean entrance'],['clean living-room'], ['clean kitchen'], 
    //             ['clean hall'], ['clean bedroom'], ['clean bathroom'], ['at vacuum entrance'],
    //             ['off', 'vacuum']
    //         ]
    //     } ) } ) )
    // }

    // ----------------------------------------------------------------------
    // fridge & dish washer simulation (fixed)

    // if(time.dd == 3 && time.hh == 13 && time.mm==00){
    //     myHouse.devices.fridge.setHalf()
    // }
    // if(time.dd == 6 && time.hh == 21 && time.mm == 0){
    //     myHouse.devices.fridge.setEmpty()
    // }
    // if(time.dd == 6 && time.hh==21 && time.mm == 5){
    //     myHouse.devices.dish_washer.turnOn() // start when fridge empty
    // }
    // if(time.dd == 6 && time.hh==22 && time.mm == 5){
    //     myHouse.devices.dish_washer.turnOff() 
    // }


    // if(time.dd == 6 && time.hh == 13 && time.mm == 00){
    //     myHouse.devices.fridge.setFull()
    // }

    // ----------------------------------------------------------------------
    // washing machine simulation
    // if(time.dd == 5 && time.hh == 18 && time.mm == 0){
    //     myHouse.devices.washing_machine.switchOnWashingMachine()
    // }
    // if(time.dd == 5 && time.hh == 19 && time.mm == 0){
    //     myHouse.devices.washing_machine.switchOffWashingMachine()
    // }

    // ----------------------------------------------------------------------
    // if(time.dd == 5 || time.dd == 6){ // clock starts from zero
    //     this.log('weekend!')
    // }
         



})

// Start clock
Clock.startTimer()


// init world beliefs
// world.beliefs.declare('robot vacuum')

// world.beliefs.declare('charging vacuum')

// world.beliefs.declare('room entrance')
// world.beliefs.declare('room living-room')
// world.beliefs.declare('room kitchen')
// world.beliefs.declare('room hall')
// world.beliefs.declare('room bedroom')
// world.beliefs.declare('room bathroom')

// world.beliefs.declare('connected entrance living-room')
// world.beliefs.declare('connected living-room entrance')

// world.beliefs.declare('connected living-room kitchen')
// world.beliefs.declare('connected kitchen living-room')

// world.beliefs.declare('connected living-room hall')
// world.beliefs.declare('connected hall living-room')

// world.beliefs.declare('connected hall bedroom')
// world.beliefs.declare('connected bedroom hall')

// world.beliefs.declare('connected hall bathroom')
// world.beliefs.declare('connected bathroom hall')

// world.beliefs.declare('at vacuum entrance')
// world.beliefs.declare('off vacuum')