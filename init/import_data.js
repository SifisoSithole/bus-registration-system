const fs = require("fs");
const { db } = require("../models");
const {
  Route,
  Bus,
  PickUp,
  DropOff,
  Station,
  Parent,
  Student,
  AssignedStudents,
  WaitingList,
} = db;

async function addPickUpAndDropOffPoints(routeId, pickUps, dropOffs) {
  try {
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
        pick_up_number: pickUp["Pick up Number"],
        time: pickUp["Pick up Time"],
      };
    });

    const pickUpData = await Promise.all(pickUpPromises);
    const createdPickUps = await PickUp.bulkCreate(pickUpData);

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
        pick_up_number: dropOff["Pick up Number"],
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

async function createBusesAndRoutes() {
  const busesData = fs.readFileSync("init/data/buses.json", "utf8");
  const buses = JSON.parse(busesData);
  const routesData = fs.readFileSync("init/data/routes.json", "utf8");
  const routes = JSON.parse(routesData);

  try {
    await Bus.sync({ force: true });
    await Route.sync({ force: true });
    await Station.sync({ force: true });
    await PickUp.sync({ force: true });
    await DropOff.sync({ force: true });

    await Bus.bulkCreate(buses);
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
    console.error("Error adding buses and routes to the database:", error);
  }
}

async function createParentAndStudentUsers() {
  if (process.env.NODE_ENV === "development") {
    try {
      await Parent.sync({ force: true });
      console.log("Creating parent users");
      const parentsData = fs.readFileSync("init/data/parents.json", "utf8");
      const parents = JSON.parse(parentsData);
      await Parent.bulkCreate(parents);
      console.log("Parent users added successfully");
    } catch (error) {
      console.error("Error adding parent users:", error);
    }

    try {
      await Student.sync({ force: true });
      console.log("Creating student users");
      const studentsData = fs.readFileSync("init/data/students.json", "utf8");
      const students = JSON.parse(studentsData);
      await Student.bulkCreate(students);
      console.log("Student users added successfully");
    } catch (error) {
      console.error("Error adding student users:", error);
    }
  } else {
    await Parent.sync();
    await Student.sync();
  }
}

async function createAssignedStudentsAndWaitingList() {
  if (process.env.NODE_ENV === "development") {
    await AssignedStudents.sync({ force: true });
    await WaitingList.sync({ force: true });
    let offset;
    try {
      const buses = await Bus.findAll();
      for (const bus of buses) {
        offset = 0;
        const pageSize = bus.capacity;

        const students = await Student.findAll({
          offset: offset,
          limit: pageSize,
        });

        if (students.length > 0) {
          const assignedStudents = students.map((student) => ({
            student_id: student.id,
            bus_id: bus.id,
            assigned_on: new Date(),
          }));

          await AssignedStudents.bulkCreate(assignedStudents);
        }

        offset += pageSize;

        console.log(
          `Assigned students for bus ${bus.id} created successfully.`
        );
      }
      console.log("All buses processed.");
    } catch (error) {
      console.error(
        "Error creating assigned students and waiting list:",
        error
      );
      throw error;
    }

    let students = [];
    do {
      try {
        students = await Student.findAll({
          offset: offset,
          limit: 100,
        });

        if (students.length > 0) {
          const waitingList = students.map((student) => ({
            student_id: student.id,
            bus_id: Math.floor(Math.random() * 3) + 1,
            waiting_since: new Date(),
            reason_for_waiting: "No available bus",
          }));

          await WaitingList.bulkCreate(waitingList);
        }

        offset += 100;
      } catch (error) {
        console.error("Error creating waiting list:", error);
        throw error;
      }
    } while (students.length > 0);
  } else {
    await AssignedStudents.sync();
    await WaitingList.sync();
  }
}

async function setupDatabase() {
  try {
    await createBusesAndRoutes();
    await createParentAndStudentUsers();
    await createAssignedStudentsAndWaitingList();
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await db.sequelize.close();
    console.log("Database connection closed");
  }
}

setupDatabase();
