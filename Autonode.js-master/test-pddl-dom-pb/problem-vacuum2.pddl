(define (problem vacuumpb2) (:domain vacuum2)
(:objects 
    vacuum ;; robot
    entrance living-room kitchen bathroom hall bedroom ;; rooms
)

(:init
    ;todo: put the initial state's facts and numeric values here
    
    ;; vacumm cleaner
    (robot vacuum)
    
    ;; room definition
    (room entrance)
    (room living-room)
    (room kitchen)
    (room bathroom)
    (room hall)
    (room bedroom)

    ;; house definition
    (connected entrance living-room)
    (connected living-room kitchen)
    (connected living-room hall)
    (connected hall bathroom)
    (connected hall bedroom)
    
    (connected bathroom hall)
    (connected bedroom hall)
    (connected hall living-room)
    (connected kitchen living-room)
    (connected living-room entrance)

    ;; def or dirty rooms
    (dirty entrance)
    (dirty living-room)
    (dirty kitchen)
    (dirty bathroom)
    (dirty hall)
    (dirty bedroom)

    ;; def init location vacuum
    (at vacuum entrance)
    
    ;(off vacuum) ;; robot initially off
    (not (on vacuum))
    (charging vacuum) ;; robot is charging at the base station located in the entrance
)

(:goal (and
   (not (dirty entrance))
    (not (dirty living-room))
    (not (dirty kitchen))
    (not (dirty bathroom))
    (not (dirty hall))
    (not (dirty bedroom))
    ; (clean entrance)
    ; (clean living-room)
    ; (clean kitchen)
    ; (clean bathroom)
    ; (clean hall)
    ; (clean bedroom)
    ;(at vacuum living-room)
    ; (at vacuum bedroom)
    
    (at vacuum entrance) ;; vacuum goes back to entrance to recharge
    ;(off vacuum)
    (not (on vacuum))
))

;un-comment the following line if metric is needed
;(:metric minimize (???))
)
