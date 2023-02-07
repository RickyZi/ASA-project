const Observable =  require('../utils/Observable')


const Person = require('./Person')
// devices
// const Light = require('./Light')
// const Heater = require('./Heater')
// const Fridge = require('./Fridge')
// const DoorLock = require('./DoorLock')
// const WashingMachine = require('./WashingMachine')
// const DishWasher = require('./DishWasher')
// const Blinds = require('./Blinds')

// const VacuumCleaner = require('./VacuumCleaner')

const {Blinds, DishWasher, DoorLock, Fridge, Heater, Light, VacuumCleaner, WashingMachine} = require('./HouseDevices')

class House {
    constructor () {
        this.people = { bob: new Person(this, 'Bob') }
        this.rooms = {
                // one floor -> entrance, kitchen, living room, bedroom, bathroom, hall (connects living room with bathroom and bedroom)
            kitchen: { name: 'kitchen', doors_to: ['living_room'], num_ppl: 0 },
            living_room: { name: 'living_room', doors_to: ['kitchen', 'hall', 'entrance'], num_ppl : 0 },
            entrance: {name: 'entrance', doors_to: ['living_room', 'outdoor'], num_ppl: 0},
            bathroom: {name: 'bathroom', doors_to: ['hall'], num_ppl: 0},
            bedroom: {name: 'bedroom', doors_to: ['hall'], num_ppl : 1},
            hall: {name: 'hall', doors_to: ['bathroom', 'bedroom', 'living_room'], num_ppl: 0}, 
            outdoor: {name: 'outdoor', doors_to: ['entrance'], num_ppl: 0} // used to simulate resident going out of the house (i.e. to work)

        }
        this.devices = {
            /*
                Rooms, devices:
                - entrance: doorLock, light, vacuumCleaner
                - living room: light, thermostat, heater,
                - kitchen: light, heater
                - bathroom: light, heater
                - bedroom: light, heater,
                - hall: light
            */

            // lights 
            kitchen_light: new Light(this, 'kitchen_light'),
            living_room_light: new Light(this, 'living_room_light'),
            //living_room_light: new Light(this, 'living_room_light_2'),
            entrance_light: new Light(this, 'entrance_light'),
            bathroom_light: new Light(this, 'bathroom_light'),
            bedroom_light: new Light(this, 'bedroom_light'),
            hall_light: new Light(this, 'hall_light'),

            // heaters -> controlled by houseAgent, turn on/off as desired by the user
            kitchen_heater: new Heater(this, 'kitchen_heater'),
            living_room_heater: new Heater(this, 'living_room_heater'),
            bathroom_heater: new Heater(this, 'bathroom_heater'),
            bedroom_heater: new Heater(this, 'bedroom_heater'),

            // firdge (kitchen)
            fridge: new Fridge(this, 'fridge'),

            // main entrance door
            entrance_door: new DoorLock(this, 'entrance_door'),
            //garage_door: new Doors(this, 'garage_door'),

            //washing machine (bathroom)
            washing_machine: new WashingMachine(this, 'washing_machine'),

            // dishwasher (kitchen)
            dish_washer: new DishWasher(this, 'dish_washer'),

            // blinds (bedroom)
            bedroom_blinds: new Blinds(this, 'bedroom_blinds'),
            bathroom_blinds: new Blinds(this, 'bathroom_blinds'),
            kitchen_blinds: new Blinds(this, 'kitchen_blinds'),
            living_room_blinds: new Blinds(this, 'living_room_blinds'),

            // vacuum cleaner
            vacuum_cleaner: new VacuumCleaner(this, 'vacuum', 'entrance')
            
        }
        this.utilities = {
            electricity: new Observable( { consumption: this.devices.kitchen_light.electricityConsumption } )
            


            // electricity consumption -> lights, heaters, fridge
            // cleaning time -> robot vacuum cleaner

            // always buy electricity -> cost during day: 0.373$/KWh, cost during night: 0.354KWh
            // schedule use of devices from 19 to 23 during the week, and from 7 to 23 during the weekend (the cheapest time slot to use electronic devices)

        }

        // initial status of the house
        // this.log('\tHouse (init) status \n\t')

        // people
        this.people.bob.observe('in_room', (v, k)=>console.log('in_room Bob ' + v) )

        // electricity consumption
        this.utilities.electricity.observe('consumption', (v,k) => console.log('electricity consumption', v))

        // devices
        //lights
        this.devices.bathroom_light.observe('status', (v,k) => console.log('bathroom ligh', v))
        this.devices.bedroom_light.observe('status', (v,k) => console.log('bedroom ligh', v))
        this.devices.hall_light.observe('status', (v,k) => console.log('hall ligh', v))
        this.devices.living_room_light.observe('status', (v,k) => console.log('living_room ligh', v))
        this.devices.kitchen_light.observe('status', (v,k) => console.log('kitchen ligh', v))
        this.devices.entrance_light.observe('status', (v,k) => console.log('entrance ligh', v))

        //heaters
        this.devices.bathroom_heater.observe('status', (v,k) => console.log('bathroom heater', v))
        this.devices.bedroom_heater.observe('status', (v,k) => console.log('bedroom heater', v))
        this.devices.kitchen_heater.observe('status', (v,k) => console.log('kitchen heater', v))
        this.devices.living_room_heater.observe('status', (v,k) => console.log('living_room heater', v))
        
        //fridge
        this.devices.fridge.observe('status', (v,k) => console.log('fridge', v))

        //washing machine
        this.devices.washing_machine.observe('status', (v,k) => console.log('washing machine', v))

        //dishwasher
        this.devices.dish_washer.observe('status', (v,k) => console.log('dishwasher', v))

        //door lock
        this.devices.entrance_door.observe('status', (v,k) => console.log('entrance_door',v))

        //vacuum cleaner
        this.devices.vacuum_cleaner.observe('status', (v,k)=> console.log('vacuum_cleaner', v))
    }
}


module.exports = House