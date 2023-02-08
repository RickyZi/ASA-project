const Observable =  require('../utils/Observable')


const Person = require('./Person')

// devices
const {Blinds, DishWasher, DoorLock, Fridge, Heater, Light, VacuumCleaner, WashingMachine} = require('./HouseDevices')

class House {
    constructor () {
        this.people = { bob: new Person(this, 'Bob') }
        this.rooms = {
                // one floor -> entrance, kitchen, living room, bedroom, bathroom, hallway (connects living room with bathroom and bedroom)
            kitchen: { name: 'kitchen', doors_to: ['living_room'], num_ppl: 0 },
            living_room: { name: 'living_room', doors_to: ['kitchen', 'hallway', 'entrance'], num_ppl : 0 },
            entrance: {name: 'entrance', doors_to: ['living_room', 'outdoor'], num_ppl: 0},
            bathroom: {name: 'bathroom', doors_to: ['hallway'], num_ppl: 0},
            bedroom: {name: 'bedroom', doors_to: ['hallway'], num_ppl : 1},
            hallway: {name: 'hallway', doors_to: ['bathroom', 'bedroom', 'living_room'], num_ppl: 0}, 
            outdoor: {name: 'outdoor', doors_to: ['entrance'], num_ppl: 0} // used to simulate resident going out of the house (i.e. to work)

        }
        this.devices = {
            /*
                Rooms, devices:
                - entrance: doorLock, light, vacuumCleaner (defined as a planning agent)
                - living room: light, thermostat, heater,
                - kitchen: light, heater
                - bathroom: light, heater
                - bedroom: light, heater,
                - hallway: light
            */

            // lights 
            kitchen_light: new Light(this, 'kitchen_light'),
            living_room_light: new Light(this, 'living_room_light'),
            //living_room_light: new Light(this, 'living_room_light_2'),
            entrance_light: new Light(this, 'entrance_light'),
            bathroom_light: new Light(this, 'bathroom_light'),
            bedroom_light: new Light(this, 'bedroom_light'),
            hallway_light: new Light(this, 'hallway_light'),

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

            //vacuum cleaner
            vacuum_cleaner: new VacuumCleaner(this, 'vacuum_cleaner', 'entrance')
            
        }
        this.utilities = {
            electricity: new Observable( { consumption: this.devices.kitchen_light.electricityConsumption } )
            // selected kitchen light because is one of the most used during the day
            
            // electricity consumption -> lights, heaters, fridge, vacuum cleaner
            // cleaning time -> robot vacuum cleaner

            // always buy electricity -> cost during day: 0.373$/KWh, cost during night: 0.354KWh
            // schedule use of devices from 19 to 23 during the week, and from 7 to 23 during the weekend (the cheapest time slot to use electronic devices)

        }

        // keep track of electricity consumption
        this.utilities.electricity.observe('consumption', (v,k) => console.log('electricity consumption', v))
    }
}


module.exports = House