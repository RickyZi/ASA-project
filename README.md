# Autonomous Software Agents - final project
University of Trento - A.Y. 2021-2022

Student: Ziglio Riccardo


## Project Description
This repository contains the implementation of the final project for the ASA course.
It models a smart home scenario, designed for a single resident (called Bob). The home is on a a single floor, and is composed by six rooms: the entrance, the living room, the kitchen, the hallway, the bathroom, and the bedroom. Each room has a main light. Heaters are present throughout the house execpt in the entrance and in the hallway. 
The home is controlled by a house agent, which has the role of interfacing with the resident via a smartphone app and schedule the device activities following the user request, while still being responsive to the user behaviour (i.e. turn on/off a room light when resident walks in/out of the room). Other two agents operate in this scenario, the secuirty agent and the vacuum agent. The former has the role to ensure the front door and all the blinds in the house are closed at night (at 23), to preserve the resident privacy and security. It will also, unlock the front door and open the blinds in the morning when the resident leaves for work.
The vacuum agent is a planning agent that has the role of keeping the house clean. In the proposed scenario runs every day at 15, when the user is not at home, and takes almost 3 hour the clean the whole house. 
For more details about the scenario and how it has been implemented please refer to the project report.



## Repo Structure
All the project's files can be found inside the _/src/myWorld_ folder.
The file _myScenario.js_ contains an implementation of the scenario with all devices and agents of the house in actions. This file models a fixed working-week schedule of the user's behaviour. The output of this schedule execution can be found in the _scenario.log_ file.
A more realistic weekly can be found in the _weeklyScenario.js_ (since this is a longer example a log file was not saved)

The agent BDI structure can be found in the _/bdi_ folder, which contains the _Agent_, _Beliefset_, _Goal_, and _Intention_ definitions.

All the scripts related to the pddl part of the project are located in the _/pddl_ folder. 
The pddl domain and problem files for the _vacuum agent_ can be found in the _/src/myWorld/tmp_ folder.


## How to run the scenario
Before running the scenario make sure to execute the command **npm init** in order to install all the dependencies of the project (contained in the package.json file).

To run the scenario, use the terminal to navigate to the _/Autonode.js-master/src/myWorld_ folder. Then, use the command **node myScenario.js** to run it. The execution will be shown on the terminal.