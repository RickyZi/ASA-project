const Observable = require('../utils/Observable');
//const Light = require('./Light');



class Person extends Observable {
    constructor (house, name, num_people) {
        super()
        this.house = house;             // reference to the house
        this.name = name;               // non-observable
        this.set('in_room', 'bedroom')  // observable
        //this.set("prev_room", "bedroom") // observable
       // this.observe( 'in_room', v => console.log(this.name, 'moved to', v) )    // observe


    }
    
    moveTo (to_room) {
        if(this.in_room == to_room){
            console.log(this.name, "\t already in " + to_room);
            return false;
        }
        if ( this.house.rooms[this.in_room].doors_to.includes(to_room) ) { // for object: to in this.house.rooms[this.in_room].doors_to
            //this.prev_room = this.in_room;
            this.house.rooms[this.in_room].num_ppl =this.house.rooms[this.in_room].num_ppl - 1;
            this.house.rooms[to_room].num_ppl = this.house.rooms[to_room].num_ppl + 1;
            console.log(this.name, ' moved to ' + to_room ); //+ ' from ' + this.in_room);//num_ppl new room: ' + this.house.rooms[to_room].num_ppl + ' num_ppl prev room: ' + this.house.rooms[this.in_room].num_ppl);
            this.in_room = to_room;
            
            // agent that deals with lights or house agent that deals with everything happening inside the house
            return true;
        }
        else {
            console.log(this.name, '\t failed moving from ', this.in_room, ' to ', to_room);
            return false;
        }
    }  
    
}



module.exports = Person