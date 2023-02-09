const Observable = require('../utils/Observable');
//const Light = require('./Light');



class Person extends Observable {
    constructor (house, name, num_people) {
        super()
        this.house = house;             
        this.name = name;               
        this.set('in_room', 'bedroom')  

        // num people used to keep track of how many perople are in that room, if num_people = 0 room declared empty

    }
    
    moveTo (to_room) {
        if(this.in_room == to_room){
            console.log(this.name, "\t already in " + to_room);
            return false;
        }
        if ( this.house.rooms[this.in_room].doors_to.includes(to_room) ) { 
            //this.prev_room = this.in_room;
            this.house.rooms[this.in_room].num_ppl =this.house.rooms[this.in_room].num_ppl - 1;
            this.house.rooms[to_room].num_ppl = this.house.rooms[to_room].num_ppl + 1;
            console.log(this.name, ' moved to ' + to_room ); 
            this.in_room = to_room;
            return true;
        }
        else {
            console.log(this.name, '\t failed moving from ', this.in_room, ' to ', to_room);
            return false;
        }
    }  
    
}



module.exports = Person