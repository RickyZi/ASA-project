const Beliefset =  require('../bdi/Beliefset')
const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')

const House = require('./House')

// -----------------------------------------------------------------------------------------------------------------------
// Device intentions

// DeviceNameManager.js -> simulate commands given to the agent for a specific device, i.e. turn on kitchen heater when resident comes back for lucnh

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

// test house alarm

// const{SenseHouseAlarmSystemIntention, SenseHouseAlarmSystemGoal} = require('./HouseAlarmSensor')


// ----------------------------------------------------------------------

// pddl actions
const{Move, CleanRoom, TurnOn, TurnOff, RetryGoal, RetryFourTimesIntention} = require('./VacuumCleanerScenario')
const PlanningGoal = require('../pddl/PlanningGoal')
// ----------------------------------------------------------------------


// ---------------- House (includes rooms and devices definition) ----------------

var myHouse = new House()

// ----------------------------------------------------------------------

// ---------------- Agents ----------------

// ---------------- House Agent ----------------
/*
    tasks:
    - turn on/off light when resident walks in/out of a room to reduce electricity consumption
    - lock main entrance door at night
    - close bedroom blinds at 22
    - turn on/off thermostats depending on user preference (fixed schedule)
    - close all windows at night
*/



var house_agent = new Agent('house_agent');

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
    myHouse.devices.hallway_light
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

house_agent.intentions.push(SenseWMIntention);
house_agent.postSubGoal(new SenseWMGoal(myHouse.devices.washing_machine))

house_agent.intentions.push(SenseDWIntention)
house_agent.postSubGoal(new SenseDWGoal(myHouse.devices.dish_washer))

house_agent.intentions.push(SenseBlindsIntention)
house_agent.postSubGoal(new SenseBlindsGoal([
    myHouse.devices.bedroom_blinds, 
    myHouse.devices.bathroom_blinds, 
    myHouse.devices.kitchen_blinds, 
    myHouse.devices.living_room_blinds
]))


// ----------------------------------------------------------------------

// ---------------- Security Agent ----------------

/*
    Tasks:
    - close entrance door at night (23)
    - close all blinds at night (23)
 */

var security_agent = new Agent('security_agent');

security_agent.intentions.push(SenseDoorLockIntention)
security_agent.postSubGoal(new SenseDoorLockGoal(myHouse.devices.front_door))

security_agent.intentions.push(DoorLockIntention)
security_agent.postSubGoal(new DoorLockGoal(myHouse.devices.front_door))

security_agent.intentions.push(BlindsIntention)
security_agent.postSubGoal(new BlindsGoal([
    myHouse.devices.bedroom_blinds, 
    myHouse.devices.bathroom_blinds, 
    myHouse.devices.kitchen_blinds, 
    myHouse.devices.living_room_blinds
]))


// ----------------------------------------------------------------------

// ---------------- Vacuum Agent ----------------

/*
    Tasks:
    - run once per week from 15 to 18 and cleans the whole house 
    - consumes 90w of electricity for each charging cycle
 */

var vacuum_agent = new Agent('weekly_vacuum_cleaner', myHouse.devices.vacuum_cleaner);

// call online planner
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, CleanRoom, TurnOn, TurnOff]) //, TurnOn, TurnOff, RetryFourTimesIntention])

vacuum_agent.intentions.push(OnlinePlanning)
vacuum_agent.intentions.push(RetryFourTimesIntention)

var sensor = (agent) => (value,key,observable) => {
    let predicate = key.split(' ')[0]
    let arg1 = key.split(' ')[1]
    if (predicate=='dirty') // dirty room_name
            key = 'dirty '+arg1; 
    else
        return;
    value?agent.beliefs.declare(key):agent.beliefs.undeclare(key)
}

house_agent.beliefs.observeAny(sensor(vacuum_agent)) // house_agent informs vacuum_agent on which rooms are dirty

function init_vacuum_belief(){
     // robot declaration
     vacuum_agent.beliefs.declare('robot vacuum')

     // room definition
     vacuum_agent.beliefs.declare('room entrance')
     vacuum_agent.beliefs.declare('room living-room')
     vacuum_agent.beliefs.declare('room kitchen')
     vacuum_agent.beliefs.declare('room hallway')
     vacuum_agent.beliefs.declare('room bathroom')
     vacuum_agent.beliefs.declare('room bedroom')
 
     // house structure definition
     vacuum_agent.beliefs.declare('connected entrance living-room')
     vacuum_agent.beliefs.declare('connected living-room entrance')
 
     vacuum_agent.beliefs.declare('connected living-room kitchen')
     vacuum_agent.beliefs.declare('connected kitchen living-room')
     
     vacuum_agent.beliefs.declare('connected living-room hallway')
     vacuum_agent.beliefs.declare('connected hallway living-room')
 
     vacuum_agent.beliefs.declare('connected hallway bathroom')
     vacuum_agent.beliefs.declare('connected bathroom hallway')
 
     vacuum_agent.beliefs.declare('connected hallway bedroom')
     vacuum_agent.beliefs.declare('connected bedroom hallway')
     
     // def init location vacuum
     vacuum_agent.beliefs.declare('at vacuum entrance')
 
     //robot initially off
     vacuum_agent.beliefs.declare('off vacuum')
 
     // robot is charging at the base station located in the entrance
     vacuum_agent.beliefs.declare('charging vacuum') 
}

// init_vacuum_belief()  // call function to init vacuum_agent beliefs

function declare_dirty_rooms(){ 
    house_agent.beliefs.declare('dirty entrance')
    house_agent.beliefs.declare('dirty living-room')
    house_agent.beliefs.declare('dirty kitchen')
    house_agent.beliefs.declare('dirty hallway')
    house_agent.beliefs.declare('dirty bathroom')
    house_agent.beliefs.declare('dirty bedroom')
}

// ----------------------------------------------------------------------

// ---------------- Simulated Daily Schedule (fixed) ----------------

// mon - friday -> work [0, 1, 2, 3, 4] (Bob always start/end the day in the bedroom)
// sat -> rest [5]
// sun -> rest [6]



/*
    working day:
    - wake up -> 6 -> breakfast scenario
    - leave for work -> 7
    - lunch -> 13 -> lunch scenario -> turn on heater + light in the kitchen + turn on heater in living room
    - go back to work at 14
    - work until 17 and come back home
    - dinner -> 19 -> dinner scenario
    - sleep -> 23
*/

/*
    weekend:
    - bob decides when to turn on/off devices 
    - no more fixed schedule, everything decided by the resident
*/

/*  
    Non smart devices smulation: 
        monday -> fridge full 
        tuesday 
        wedenesday 
        thursday -> fridge  half
        friday 
        saturday -> washing day, start washing machine in the morning
        sunday -> fridge empty -> start dishwasher because full, need to wash dishes
*/


// ----------------------------------------------------------------------

Clock.global.observe('mm', (mm) => {
    var time = Clock.global

    // --------------------------------------------------------
    // possible weekly schedule (fixede execution of devices)
    // --------------------------------------------------------

    // resident alway starts the day in the bedroom at 6 AM
    
    if(time.hh==6 && time.mm==5){
        myHouse.people.bob.moveTo('hallway')
    }
    if(time.hh==6 && time.mm==10){
        myHouse.people.bob.moveTo('bathroom')
    }
    if(time.hh==6 && time.mm==15){
        myHouse.people.bob.moveTo('hallway')
    }
        
    if(time.hh==6 && time.mm==20){
        myHouse.people.bob.moveTo('living_room')
    }
    
    // brekfast scenario 
    if(time.hh==6 && time.mm==25){
        myHouse.people.bob.moveTo('kitchen')
    }
    
    if(time.hh == 6 && time.mm == 45){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 6 && time.mm==50){
        myHouse.people.bob.moveTo('entrance')
        // myHouse.devices.entrance_door.unlockDoor()
    }
        
    if(time.hh==7 && time.mm==0){
        myHouse.people.bob.moveTo('outdoor')
        // myHouse.devices.entrance_door.lockDoor() // Bob locks the entrance door
    }

    // ----------------------------------------------------------------------
    // lunch scenario 
    // Bob comes back home for lunch
    
    if(time.hh==13 && time.mm==00){
        // myHouse.devices.entrance_door.unlockDoor() // Bob unlocks the entrance door
        myHouse.people.bob.moveTo('entrance') 
    }
    if(time.hh == 13 && time.mm == 5){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 13 && time.mm == 10){
        myHouse.people.bob.moveTo('kitchen')
    }
    
    if(time.hh == 14 && time.mm == 20){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 14 && time.mm == 25){
        myHouse.people.bob.moveTo('entrance')
    }

    if(time.hh==14 && time.mm==30){
        myHouse.people.bob.moveTo('outdoor') // bob leaves again for work
        // myHouse.devices.entrance_door.lockDoor()
    }
    
    // ----------------------------------------------------------------------
    
    // Bob finish working and comes back home
    // dinner scenario

    if(time.hh==19 && time.mm==0){
        // myHouse.devices.entrance_door.unlockDoor() //bob unlocks door
        myHouse.people.bob.moveTo('entrance')
    }
        
    if(time.hh==19 && time.mm==5){
        myHouse.people.bob.moveTo('living_room')
    }
        
    if(time.hh==19 && time.mm==10){
        myHouse.people.bob.moveTo('hallway')
    }
        
    if(time.hh==19 && time.mm==15){
        myHouse.people.bob.moveTo('bathroom')
        myHouse.devices.washing_machine.switchOnWashingMachine()
    }
        
    if(time.hh==19 && time.mm==20){
        myHouse.people.bob.moveTo('hallway')
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
        
    // security agent close all blinds
    if(time.hh==22 && time.mm==0){
        myHouse.people.bob.moveTo('hallway')
    }
        
    if(time.hh==22 && time.mm==5){
        myHouse.people.bob.moveTo('bathroom')
        myHouse.devices.washing_machine.switchOffWashingMachine()
    }
        

    if(time.hh==22 && time.mm==25){
        myHouse.people.bob.moveTo('hallway')
        myHouse.devices.dish_washer.turnOff()

    }
        
    // turn off heaters
    if(time.hh==22 && time.mm==30){
        myHouse.people.bob.moveTo('bedroom')
        
    }
    
    // security agent make sure entrance door is closed
    if(time.hh == 23 && time.mm == 0){
        myHouse.devices.bedroom_light.switchOffLight() // resident goes to sleep
    }

    
    // ----------------------------------------------------------------------
    // fridge, washing machine, dishwasher, and vacuum cleaner simulation during the week

    // vacuum cleaner called once per week since house small 
    // and resident is outside for most of the week

    if(time.dd == 3){
        init_vacuum_belief() // def house strcutre and initial knowledge of the vacuum robot
    }
    if(time.dd == 3 && time.hh == 14 && time.mm==45){
        
        declare_dirty_rooms() // all rooms are dirty since the resident used them
    }
    if(time.dd == 3 && time.hh == 15 && time.mm == 0){
        // post goal to vacuum, which will try to achieve it up to 4 times
        vacuum_agent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: 
            [
                ['clean entrance'],['clean living-room'], ['clean kitchen'], 
                ['clean hallway'], ['clean bedroom'], ['clean bathroom'], 
                ['at vacuum entrance'], ['off vacuum']
            ]
        } ) } ) )
    }

    // ----------------------------------------------------------------------
    // fridge & dish washer simulation (fixed)

    if(time.dd == 3 && time.hh == 13 && time.mm==00){
        myHouse.devices.fridge.setHalf()
    }
    if(time.dd == 6 && time.hh == 21 && time.mm == 0){
        myHouse.devices.fridge.setEmpty()
    }
    if(time.dd == 6 && time.hh==21 && time.mm == 5){
        myHouse.devices.dish_washer.turnOn() // start when fridge empty
    }
    if(time.dd == 6 && time.hh==22 && time.mm == 5){
        myHouse.devices.dish_washer.turnOff() 
    }

    if(time.dd ==7){ // end of the simulated week
        Clock.stopTimer()
    }
         
})

Clock.startTimer()