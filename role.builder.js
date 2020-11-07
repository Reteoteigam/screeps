let LOGGER = require('util.log')
const MAPPING_STRUCTURETYPE = require('util.mapping.structureType');
const managertransport = require('manager.transport');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
      LOGGER.debug("roleBuilder run: " + creep);

      creep.memory.building = false;
      let homespawn = Game.getObjectById(creep.memory.home);






      //orderEnergy if need
      if ((creep.store.getUsedCapacity() / creep.store.getCapacity()) <= 0.3) {
        managertransport.orderTo(homespawn, creep);
      }

      //repair
      //first core
      if (homespawn.room.controller.ticksToDowngrade < 300) {
        let error = creep.upgradeController(creep.room.controller)
        switch (error) {
          case OK:
            LOGGER.debug("roleBuilder upgradeController at " + creep.pos);
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(creep.room.controller, {
              visualizePathStyle: {
                stroke: '#ffffff'
              },
              reusePath: 25
            });
            break;
          default:
            LOGGER.error("roleBuilder upgradeController at " + creep.pos + " with error " + error)
            break;
        }
        creep.memory.building = true;
        creep.say("🚧" + creep.room.controller.structureType);

        return;
      }

      let repairSites = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax*0.9
      });
      // prio low hp + range;
      repairSites.sort((a, b) => a.hits - b.hits + a.pos.getRangeTo(creep.pos) + 1 - b.pos.getRangeTo(creep.pos)); //speichere diese entscheitung für in paar ticks -> paar ticks
      LOGGER.debug("REPAIR NEED? :" + repairSites);
      if (repairSites[0]) {

        let error = creep.repair(repairSites[0]);
        if (error == ERR_NOT_IN_RANGE) {
          error = creep.moveTo(repairSites[0], {
            visualizePathStyle: {
              stroke: '#ffff00'
            },
            reusePath: 25
          });
        }
        if (error != OK) {
          LOGGER.error("roleBuilder repair +" + repairSites[0].pos + " error " + error);
        }
        creep.memory.building = true;
        creep.say("🚧" + repairSites[0].structureType);
        return;
      }

      let toBuilds = creep.room.find(FIND_CONSTRUCTION_SITES);
      // prio low hp + range;
      toBuilds.sort((a, b) => MAPPING_STRUCTURETYPE.valueOf(a.structureType) - MAPPING_STRUCTURETYPE.valueOf(b.structureType) + a.pos.getRangeTo(creep.pos) - b.pos.getRangeTo(creep.pos));
      LOGGER.debug("BUILD NEED? :" + toBuilds);
      if (toBuilds[0]) {
        let error = creep.build(toBuilds[0]);
        if (error == ERR_NOT_IN_RANGE) {
          creep.moveTo(toBuilds[0], {
            visualizePathStyle: {
              stroke: '#ffff00'
            },
            reusePath: 25
          });
        }
        creep.memory.building = true;
        creep.say("🚧" + toBuilds[0].structureType);
        return;
      } else {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            creep.upgradeController(creep.room.controller);
          }
        }
        LOGGER.debug("roleBuilder done: " + creep);
        return creep.memory.building;
      }
    };

    module.exports = roleBuilder;
