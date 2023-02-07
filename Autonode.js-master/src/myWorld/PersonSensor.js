const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Person = require('./Person');

// to sense person intention and turn on/off lights when it enters a room

// NOTE: person (singular) and people (plural)


class SensePeopleGoal extends Goal {

    constructor (People = []) {
        super()

        /** @type {Array<Light>} lights */
        this.People = People
    }

}

// how to check if person in room and activate light in that room?

class SensePeopleIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Light>} lights */
        this.People = this.goal.People
    }
    
    static applicable (goal) {
        return goal instanceof SensePeopleGoal
    }
    
    *exec () {
        var PeopleGoals = []
        for (let p of this.People) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let PeopleGoalPromise = new Promise( async res => {
                while (true) {

                    let prev_room = p.in_room
                    let new_room  = await p.notifyChange('in_room')

                    
                    this.log('sense: person ' + p.name + ' moved to ' + new_room+ ' from ' + prev_room)

                    if(new_room != prev_room && new_room != 'outdoor' && p.house.rooms[new_room].num_ppl > 0 && p.house.devices[new_room+'_light'].status == 'off'){
                        p.house.devices[new_room+'_light'].switchOnLight();
                    }

                    if(prev_room != 'outdoor' && p.house.rooms[prev_room].num_ppl == 0){
                        //console.log('person in room '+ prev_room + ': 0');
                        p.house.devices[prev_room+'_light'].switchOffLight();
                    }

                    // prev room should be alrady empty

                    this.agent.beliefs.declare('person_in_room ' +p.name + ' ' + new_room); // person_in_room bob bathroom
                    this.agent.beliefs.undeclare('empty '+ new_room);
                    if(prev_room != new_room){
                        this.agent.beliefs.undeclare('person_in_room ' +p.name + ' ' + prev_room); // person_in_room bob bathroom
                        this.agent.beliefs.declare('empty '+ prev_room);
                    }
                    
                    
                    // if(prev_room == new_room){
                    //     this.log('prev_room:' + prev_room + ' new room: ' + new_room);
                    //     this.agent.beliefs.declare('person_in_room ' +p.name + ' ' + new_room); // person_in_room bob bathroom
                    //     this.agent.beliefs.undeclare('empty '+ new_room);
                    // }
                    

                    // if(new_room != 'outdoor' && p.house.devices[new_room+'_light'] && p.house.devices[p.prev_room+'_light'] && (new_room != p.prev_room)){
                    //     p.house.devices[new_room+'_light'].switchOnLight();
                    //     p.house.devices[p.prev_room+'_light'].switchOffLight();
                    // }
                    // else{
                    //     console.log("no light in "+new_room)
                    // }

                    // if(new_room != 'outdoor'){
                    //     this.agent.beliefs.declare('person_in_room ' +p.name + ' ' + new_room); // person_in_room bob bathroom
                    //     this.agent.beliefs.undeclare('empty '+ new_room);
                    // }
                    


                    // if((p.prev_room != 'undefined' || p.prev_room != 'outdoor') && (p.prev_room != new_room)){
                    //     //console.log('previous room ' + p.prev_room);
                    //     this.agent.beliefs.declare('empty '+p.prev_room);
                    //     this.agent.beliefs.undeclare('person_in_room ' +p.name+' '+p.prev_room);
                    // }
                
                    
                    // else if(p.house.devices[p.prev_room+'_light']){
                    //     p.house.devices[p.prev_room+'_light'].switchOffLight();
                    // }
                    // else{
                    //     p.house.devices[new_room+'_light'].switchOnLight();
                    // }
                    
                    // undeclare agent beliefs
                    
                    // this.agent.beliefs.undeclare('dirty ' + p.prev_room);
                    // this.agent.beliefs.declare('clean '+p.prev_room)

                    // this.agent.beliefs.undeclare('empty '+p.prev_room);
                    // this.agent.beliefs.declare('person_in_room ' +p.nam+' '+p.prev_room);

                    // for(let room of this.house.rooms){
                    //     if(room != new_room){
                    //         this.agent.beliefs.undeclare('person_in_room ' +p.name + ' ' + new_room);
                    //     }
                    // }

                    // vacuum agent starts to clean the house when all rooms are empty
                    // var belief = this.agent.beliefs;
                    // let r = [] // non empty rooms
                    // for(const[key, value] of Object.entries(belief)){
                    //     if(key.split(" ")[0] == 'person_in_room'){ // person_in_room person_name room_name
                    //         if(value == true){
                    //             r.push(this.house.rooms[key.split(" ")[2]].name);
                    //         }
                    //     }
                    // }

                    // for(let room in this.house.rooms){
                    //     if(!(r.includes(room))){ // if 
                    //         this.agent.beliefs.declare('empty '+room)
                    //     }
                    // }
                    // for(let r of this.house.room){
                    //     this.agent.beliefs.declare('dirty'+r);
                    // }

                    //this.agent.beliefs.declare('dirty '+ p.prev_room);
                    

                    // this.agent.beliefs.declare(p.name + ' in '+ new_room)
                    // this.agent.beliefs.declare('not '+ p.name+ ' in '+ p.prev_room)
                    /**
                     * TODO:
                     *  Bob moves to a new_room -> the prev_room is now empty
                     *  if the prev_room_light is still on it should be turned off i.e. after 15 min
                     * managed by the house_agent
                     */

                    // --------------------------------------------------------------------------------------------

                    // change agent beliefs 

                    // this.agent.beliefs.declare('person_in_room'+p.name+' '+new_room);
                    // this.agent.beliefs.undeclare('empty' + new_room);

                    // for(let room in this.house.rooms){
                    //     if(room != new_room){
                    //         this.agent.beliefs.undeclare('person_in_room'+p.name+' '+new_room);
                    //     }
                    // }

                    // set empty rooms
                    // var belief = this.agent.beliefs;
                    // let not_empty_rooms = []
                    // check in all the rooms in the house if there's someone, otherwise set to empty
                    
                    
                    // --------------------------------------------------------------------------------------------

                    // if bob moves to another room that has light switched off it should be turned on,
                    // also turn off light of previous room
                    // if previous room or next room doens't have light do nothing (manage outside as a room)
                    
                    // if(p.house.devices[p.prev_room+'_light'] && p.house.devices[p.prev_room+'_light'].status == 'on' ){
                    //     p.house.devices[p.prev_room + '_light'].switchOffLight()
                    //     this.log(p.prev_room+'_light turned off')
                    //     //this.log(p.name + 'moved to ' + new_room)
                    // }
                    // else if(p.house.devices[p.prev_room+'_light'].status == 'off'){
                    //     this.log('light already OFF in ' + p.prev_room)
                    // }
                    // else{
                    //      this.log(' NO light in ' + p.prev_room)
                    // }

                    // if(p.house.devices[new_room+'_light'] && p.house.devices[new_room+'_light'].status == 'off'){
                    //     p.house.devices[new_room+'_light'].switchOnLight() 
                    //     this.log(p.next_room+'_light turned on')
                    // }
                    // else if(p.house.devices[new_room+'_light'].status == 'on'){
                    //     this.log('light already ON in ' + new_room)
                    // }
                    // else{
                    //     //this.log('person ' +p.name+ ' moved from '+ p.prev_room + ' to ' + new_room + ', NO light in this room')
                    //     this.log(' NO light in ' + new_room)
                    // }
                    
                //     this.agent.beliefs.declare('light_on '+l.name, status=='on')
                //     this.agent.beliefs.declare('light_off '+l.name, status=='off')
                }
            });

            PeopleGoals.push(PeopleGoalPromise)
        }
        yield Promise.all(PeopleGoals)
    }
}


module.exports = {SensePeopleGoal, SensePeopleIntention}