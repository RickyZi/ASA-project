;Header and description

(define (domain vacuum3)

;remove requirements that are not needed
(:requirements :strips );:fluents :durative-actions :timed-initial-literals :typing :conditional-effects :negative-preconditions :duration-inequalities :equality)

; (:types ;todo: enumerate types and their hierarchy here, e.g. car truck bus - vehicle
; )

; un-comment following line if constants are needed
;(:constants )

(:predicates ;todo: define predicates here
    (robot ?v)
    (room ?r)
    (at ?v ?r)
    (connected ?r1 ?r2)
    ; (on ?v)
    ; (off ?v)
    (empty ?r)
    (clean ?r)
)


; (:functions ;todo: define numeric functions here
; )

;define actions here
(:action move
    :parameters (?v ?source ?destination)
    :precondition (and (robot ?v) (room ?source) (room ?destination) (connected ?source ?destination) (at ?v ?source)); (on ?v) )
    :effect (and (at ?v ?destination) (not (at ?v ?source)))
)

(:action cleanRoom
    :parameters (?v ?r)
    :precondition (and (robot ?v) (room ?r) (at ?v ?r) (empty ?r)); (on ?v))
    :effect (and (clean ?r))
)

; (:action turnOn
;     :parameters (?v)
;     :precondition (and (robot ?v) (off ?v))
;     :effect (and (on ?v) (not (off ?v)))
; )

; (:action tunrOff 
;     :parameters (?v)
;     :precondition (and (robot ?v) (on ?v))
;     :effect (and (off ?v) (not (on ?v)))
; )


)