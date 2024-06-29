const fs = require("fs");
const { db } = require("../models");
const { Route, Bus, PickUp, DropOff, Station } = db;

async function addPickUpAndDropOffPoints(routeId, pickUps, dropOffs) {
  try {
    // Process pick-up points
    const pickUpPromises = pickUps.map(async (pickUp) => {
      let station = await Station.findOne({
        where: { location: pickUp["Pick up Name"] },
      });

      if (!station) {
        station = await Station.create({
          location: pickUp["Pick up Name"],
        });
      }

      return {
        route_id: routeId,
        station_id: station.id,
        time: pickUp["Pick up Time"],
      };
    });

    const pickUpData = await Promise.all(pickUpPromises);
    const createdPickUps = await PickUp.bulkCreate(pickUpData);

    // Process drop-off points
    const dropOffPromises = dropOffs.map(async (dropOff) => {
      let station = await Station.findOne({
        where: { location: dropOff["Drop off Name"] },
      });

      if (!station) {
        station = await Station.create({
          location: dropOff["Drop off Name"],
        });
      }

      return {
        route_id: routeId,
        station_id: station.id,
        time: dropOff["Drop off Time"],
      };
    });

    const dropOffData = await Promise.all(dropOffPromises);
    const createdDropOffs = await DropOff.bulkCreate(dropOffData);

    console.log(`Pick-up and drop-off points added for route ${routeId}`);
  } catch (error) {
    console.error("Error adding pick-up and drop-off points:", error);
  }
}

const busesData = fs.readFileSync("init/data/bus.json", "utf8");
const buses = JSON.parse(busesData);
const routesData = fs.readFileSync("init/data/route.json", "utf8");
const routes = JSON.parse(routesData);

db.sequelize.sync({ force: true }).then(async () => {
  console.log("Database synced");

  try {
    for (let bus of buses) {
      await Bus.create({
        bus_number: bus.bus_number,
        capacity: bus.capacity,
      });
    }

    console.log("Buses added to the database successfully");

    for (let routeData of routes) {
      const bus = await Bus.findOne({
        where: { bus_number: routeData.Bus.bus_number },
      });

      if (bus) {
        const createdRoute = await Route.create({
          route_name: routeData["Bus Route"],
          bus_id: bus.id,
        });

        await addPickUpAndDropOffPoints(
          createdRoute.id,
          routeData.Bus["Morning pick up"],
          routeData.Bus["Afternoon Drop off"]
        );
      } else {
        console.error(`Bus with number ${routeData.Bus.bus_number} not found.`);
      }
    }

    console.log("Routes added to the database successfully");
  } catch (error) {
    console.error("Error adding routes to the database:", error);
  }
});
