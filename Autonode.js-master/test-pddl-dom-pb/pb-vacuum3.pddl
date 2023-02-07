(define (problem vacuumpb3) (:domain vacuum3)
(:objects 
    vacuum
    entrance living-room kitchen hall bedroom bathroom
)

(:init
    ;todo: put the initial state's facts and numeric values here
    (robot vacuum)

    (room entrance)
    (room living-room)
    (room kitchen)
    (room bedroom)
    (room bathroom)
    (room hall)

    (connected entrance living-room)
    (connected living-room entrance)
    (connected living-room kitchen)
    (connected kitchen living-room)
    (connected living-room hall)
    (connected hall living-room)
    (connected hall bedroom)
    (connected hall bathroom)
    (connected bedroom hall)
    (connected bathroom hall)

    (empty entrance)
    (empty living-room)
    (empty kitchen)
    (empty hall)
    (empty bedroom)
    (empty bathroom)

    (at vacuum entrance)
    
)

(:goal (and
    ;todo: put the goal condition here
    (clean entrance)
    (clean living-room)
    (clean kitchen)
    (clean hall)
    (clean bathroom)
    (clean bedroom)

    (at vacuum entrance)
))

;un-comment the following line if metric is needed
;(:metric minimize (???))
)
