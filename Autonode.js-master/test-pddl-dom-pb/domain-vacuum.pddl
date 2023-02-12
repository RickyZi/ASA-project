;; First definition of the vacuum agent domain that was then used to define the agent's actions in the vacuumCleanerScenario.js file
;; tested using the same online planner as the one used by the OnlinePlanner.js file

(define (domain vacuum)

;remove requirements that are not needed
(:requirements :strips );:negative-preconditions);:fluents :durative-actions :timed-initial-literals :typing :conditional-effects :negative-preconditions :duration-inequalities :equality)

; (:types ;todo: enumerate types and their hierarchy here, e.g. car truck bus - vehicle
;     vacuum
;     room
; )

; un-comment following line if constants are needed
;(:constants )

(:predicates ;todo: define predicates here
    (robot ?v) ;; vaccum is a robot
    (room ?r) ;; room def (i.e. entrance, kitchen, etc.)
    (at ?v ?r) ;; location predicate 
    (dirty ?r) ;; room dirty
    (clean ?r) ;; room clean (goal: clean all rooms of the house)
    (connected ?r1 ?r2) ;; room r1 is adjacent to room r2
    (on ?v) ;; vacuum is turnedOn
    (off ?v) ;; vacuum is turnedOff
    (charging ?v) ;; robot battery is charging
    (discharging ?v) ;; robot batter is discharging
)


;; NOTE: we're using CLOSE WORLD ASSUMPTION, all the predicates that do not change keep the same status (i.e. predicate will be true until stated otherwise)

;; actions: move, clean, turnOn, turnOff

;; move(vacuum, source, destination)
(:action move
    :parameters (?v ?source ?destination)
    :precondition (and (robot ?v) (room ?source) (room ?destination) (at ?v ?source) (connected ?source ?destination) (on ?v))  ; (discharging ?v))
    :effect (and (at ?v ?destination) (not (at ?v ?source)) )
)

;; clean(vacuum, room) 
(:action clean-room
    :parameters (?v ?r)
    :precondition (and (robot ?v) (room ?r) (at ?v ?r) (dirty ?r) (on ?v)) ; (discharging ?v) ) 
    :effect (and (clean ?r) (not (dirty ?r)) (on ?v))
)

;; turnOn(vacuum)
(:action turn-on
    :parameters (?v)
    :precondition (and (robot ?v) (off ?v) (charging ?v))
    :effect (and (on ?v)(not (off ?v)) (discharging ?v) (not (charging ?v)))
)

; ;; turnOff(vacuum)
(:action turn-off
    :parameters (?v)
    :precondition (and (robot ?v) (on ?v) (discharging ?v))
    :effect (and (off ?v) (not (on ?v)) (charging ?v) (not (discharging ?v)) )
)

)