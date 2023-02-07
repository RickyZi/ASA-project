const Beliefset =  require('../')
const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')

const House = require('../House')

// const Person = require('./Person')
// const Light = require('./Light')

// -----------------------------------------------------------------------------------------------------------------------
// SenseDevice intentions

// DeviceNameManager.js -> simulate commands given to the agent for a specific device, i.e. turn on kitchen heater when resident comes back for lucnh

const {AlarmGoal, AlarmIntention} = require('../Alarm')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('../LightSensor')
// const Heater = require('./Heater')
const { SenseHeatersGoal, SenseHeatersIntention, SenseOneHeaterGoal, SenseOneHeaterIntention } = require('../HeaterSensor')
// added heater (device + sensor) -> turn on/off similar to lights

const {HeatersGoal, HeatersIntention} = require('../HeatersManager')

// const Fridge = require('./Fridge')
const { SenseFridgeIntention, SenseFridgeGoal } = require('../FridgeSensor')

// const DoorLock = require('./DoorLock')
const { SenseDoorLockGoal, SenseDoorLockIntention } = require('../DoorLockSensor')
const {DoorLockGoal, DoorLockIntention} = require('../DoorLockManager')

const { SensePeopleIntention, SensePeopleGoal } = require('../PersonSensor')

// const WashingMachine = require('./WashingMachine')
const {SenseWMGoal, SenseWMIntention} = require('../WashingMachineSensor')

// const DishWasher = require('./DishWasher')
const {SenseDWIntention, SenseDWGoal} = require('./DishWasherSensor')

// const Blinds = require('./Blinds')
const {SenseBlindsGoal, SenseBlindsIntention, SenseOneBlindGoal, SenseOneBlindIntention} = require('./BlindsSensor')
const {BlindsGoal, BlindsIntention} = require('./BlindsManager')

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

/*
    Tasks:
    - close entrance door at night (23)
    - close all blinds at night (23)
 */

security_agent.intentions.push(SenseDoorLockIntention)
security_agent.postSubGoal(new SenseDoorLockGoal(myHouse.devices.entrance_door))

security_agent.intentions.push(DoorLockIntention)
security_agent.postSubGoal(new DoorLockGoal(myHouse.devices.entrance_door))

security_agent.intentions.push(BlindsIntention)
security_agent.postSubGoal(new BlindsGoal([myHouse.devices.bedroom_blinds, myHouse.devices.bathroom_blinds, myHouse.devices.kitchen_blinds, myHouse.devices.living_room_blinds]))

// ----------------------------------------------------------------------

// ---------------- Vacuum Agent ----------------

/*
    Tasks:
    - run everyday from 15 to 17 and cleans the whole house 
    (6 rooms, 20 min each, takes 2h to clean whole house)
 */




// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

// ---------------- Simulated Weekend Schedule (fixed) ----------------

// mon - friday -> work [0, 1, 2, 3, 4] (Bob always start/end the day in the bedroom)
// sat -> party! [5]
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
    Fridge smulation: 
        monday -> fridge full 
        tuesday 
        wedenesday 
        thursday -> fridge  half
        friday 
        saturday -> washing day, start washing machine in the morning
        sunday -> fridge empty -> start dishwasher because full, need to wash dishes
*/

/*
    weekend:
    - bob decides when to turn on/off devices 
    - no more fixed schedule, everything decided by the resident
*/

// ----------------------------------------------------------------------

//console.log("\n\tbob in " + myHouse.people.bob.in_room + "\t")

Clock.global.observe('mm', (mm) => {
    var time = Clock.global

        
    //  if(time.hh==6 && time.mm==0){ // Alarm
    //     // ALARM 
    //     // start of the day
    //  } 
       
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
    

    // ----------------------------------------------------------------------
    
    // Bob comes back home for lunch
    
    // lunch scenario 

    if(time.hh==13 && time.mm==00){
        myHouse.people.bob.moveTo('entrance')
        myHouse.devices.entrance_light.switchOnLight()
        
         
        // myHouse.devices.kitchen_heater.switchOnHeater()
        //myHouse.devices.fridge.setEmpty()
    }
    if(time.hh == 13 && time.mm == 5){
        myHouse.people.bob.moveTo('living_room')
    }
    if(time.hh == 13 && time.mm == 10){
        myHouse.people.bob.moveTo('kitchen')
        // myHouse.devices.kitchen_light.switchOnLight()
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
        myHouse.people.bob.moveTo('outdoor') // bob leaves again for work
        //declare_dirty_rooms()
        // vacuum_agent.beliefs.declare('dirty entrance')
        //declare_dirty_rooms()
    }
    
    // ----------------------------------------------------------------------
    // test vacuum agent

    if(time.hh == 15 && time.mm == 0){
        
        // call vacuum agent to satisfy goal
        // vacuum_agent.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: ['on vacuum'] } ) } ))
        // TypeError: precondition is not iterable
    }

    // ----------------------------------------------------------------------
    // Bob finish working and comes back home
    // dinner scenario

    if(time.hh==19 && time.mm==0){
        myHouse.people.bob.moveTo('entrance')
    }
       
    if(time.hh==19 && time.mm==5)
        myHouse.people.bob.moveTo('living_room')
    if(time.hh==19 && time.mm==10)
        myHouse.people.bob.moveTo('hall')
    if(time.hh==19 && time.mm==15)
        myHouse.people.bob.moveTo('bathroom')
    if(time.hh==19 && time.mm==20)
        myHouse.people.bob.moveTo('hall')
    if(time.hh==19 && time.mm==25)
        myHouse.people.bob.moveTo('living_room')

    if(time.hh==19 && time.mm==30)
        myHouse.people.bob.moveTo('kitchen') // dinner scenario

    if(time.hh==20 && time.mm==15)
        myHouse.people.bob.moveTo('living_room')

    if(time.hh==22 && time.mm==0){
        myHouse.people.bob.moveTo('hall')
    }
        
    if(time.hh==22 && time.mm==5)
        myHouse.people.bob.moveTo('bathroom')
    if(time.hh==22 && time.mm==25)
        myHouse.people.bob.moveTo('hall')

    // turn off heaters
    if(time.hh==22 && time.mm==30){
        myHouse.people.bob.moveTo('bedroom')
    }
    
    // ----------------------------------------------------------------------
    // fridge & dish washer simulation (fixed)

    // if(time.dd == 3 && time.hh == 13 && time.mm==00){
    //     myHouse.devices.fridge.setHalf()
    // }
    if(time.hh == 21 && time.mm == 0){
        myHouse.devices.fridge.setEmpty()
    }
    if(hh==22 && time.mm == 0){
        myHouse.devices.dish_washer.turnOn() // start when fridge empty
    }
    if(time.hh==22 && time.mm == 45){
        myHouse.devices.dish_washer.turnOff() 
    }


    // if(time.dd == 6 && time.hh == 13 && time.mm == 00){
    //     myHouse.devices.fridge.setFull()
    // }

    // ----------------------------------------------------------------------
    // washing machine simulation
    if(time.hh == 19 && time.mm == 0){
        myHouse.devices.washing_machine.switchOnWashingMachine()
    }
    if(time.hh == 19 && time.mm == 45){
        myHouse.devices.washing_machine.switchOffWashingMachine()
    }

    // ----------------------------------------------------------------------
    // if(time.dd == 5 || time.dd == 6){ // clock starts from zero
    //     this.log('weekend!')
    // }
         

})

// Start clock
Clock.startTimer()