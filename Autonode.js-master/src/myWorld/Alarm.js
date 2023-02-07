const Goal = require('../bdi/Goal');
const Intention = require('../bdi/Intention');
const Clock = require('../utils/Clock');


// var weekDays = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 
//                 4: 'Friday', 5: 'Saturday', 6: 'Sunday'}

class AlarmGoal extends Goal {
    
}

class AlarmIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AlarmGoal
    }
    *exec(){
        while(true) {
            Clock.global.notifyChange('mm')
            if (Clock.global.hh == 6) this.log('ALARM' + Clock.global.mm)
            yield
            if (Clock.global.hh == 6) {
                // Log a message!
                this.log('ALARM, it\'s 6am!')
                break;
            }
        }
    }
}



module.exports = {AlarmGoal, AlarmIntention}