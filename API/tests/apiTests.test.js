const request = require("supertest");
const app = require("../index.js");

// Function to clear the database
async function clearDatabase() {
  const mongoose = require("mongoose");
  for (const collection in mongoose.connection.collections) {
    if (collection === "users") {
      continue;
    }
    await mongoose.connection.collections[collection].deleteMany({});
  }
}

// Function to populate the database
async function populateDatabase(tokenUser) {
  const tickets = [
    {
      title: "Ticket 1",
      type: "Issue",
      building: "Building A",
      floor: "1",
      room: "101",
      description: "First test ticket",
      image: [],
    },
    {
      title: "Ticket 2",
      type: "Issue",
      building: "Building B",
      floor: "2",
      room: "202",
      description: "Second test ticket",
      image: [],
    },
    {
      title: "Ticket 3",
      type: "Issue",
      building: "Building C",
      floor: "3",
      room: "303",
      description: "Third test ticket",
      image: [],
    },
  ];

  for (const ticket of tickets) {
    await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(ticket);
  }
}

describe("API Tests", () => {
  let tokenUser;
  let tokenAdmin;
  let tokenWorker;
  let tokenTechnician;

  beforeAll(async () => {
    // Login to get the tokens
    const userResponse = await request(app).post("/login").send({
      username: "testUser",
      password: "user123",
    });
    tokenUser = userResponse.body.token;

    const tecnicoResponse = await request(app).post("/login").send({
      username: "testTecnico",
      password: "tecnico123",
    });
    tokenTechnician = tecnicoResponse.body.token;

    const workerResponse = await request(app).post("/login").send({
      username: "testWorker",
      password: "worker123",
    });
    tokenWorker = workerResponse.body.token;

    const adminResponse = await request(app).post("/login").send({
      username: "Admin",
      password: "pass123",
    });
    tokenAdmin = adminResponse.body.token;

    populateDatabase(tokenUser);
  });

  afterAll(async () => {
    // Clear the database
    await clearDatabase();

    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  //=================================================================================================
  // ALL THE FOLLOWING TESTS ARE GENERALIZED FOR ALL THE USERS
  //=================================================================================================

  test("Access protected route without token", async () => {
    const response = await request(app).get("/updates");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Accesso negato");
  });

  test("Login as Tecnico with valid credentials", async () => {
    const tecnicoResponse = await request(app).post("/login").send({
      username: "testTecnico",
      password: "tecnico123",
    });

    expect(tecnicoResponse.status).toBe(200);
    expect(tecnicoResponse.body.token).toBeDefined(); // THE JWT TOKEN
  });

  //=================================================================================================
  // ALL THE FOLLOWING TESTS ARE SPECIFIC FOR THE USER
  //=================================================================================================

  test("Get all my tickets with a certain state with pagination", async () => {
    const response = await request(app)
      .get("/tickets/In accettazione/?page=1&limit=2")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(response.status).toBe(200);
    expect(response.body.tickets).toBeInstanceOf(Array);
    if (response.body.tickets.length > 0) {
      response.body.tickets.forEach((ticket) => {
        expect(ticket.state).toBe("In accettazione");
      });
    }
  });

  test("Get all updates on my followed or created tickets", async () => {
    const response = await request(app)
      .get("/updates")
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((update) => {
      expect(update).toHaveProperty("title");
      expect(update).toHaveProperty("type");
      expect(update).toHaveProperty("state");
    });
  });

  test("Delete one of your tickets before acceptance", async () => {
    const response = await request(app)
      .get("/tickets/In accettazione/")
      .set("Authorization", `Bearer ${tokenUser}`);

    const ticketId = response.body.tickets[0]._id;

    const deleteResponse = await request(app)
      .delete(`/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Ticket eliminato con successo");
  });

  //=================================================================================================
  // ALL THE FOLLOWING TESTS ARE SPECIFIC FOR THE TECNICO
  //=================================================================================================

  test("Get all tickets to be accepted", async () => {
    const response = await request(app)
      .get("/tickets/In accettazione/?page=1&limit=2")
      .set("Authorization", `Bearer ${tokenTechnician}`);

    expect(response.status).toBe(200);
    expect(response.body.tickets).toBeInstanceOf(Array);
    if (response.body.tickets.length > 0) {
      response.body.tickets.forEach((ticket) => {
        expect(ticket.state).toBe("In accettazione");
      });
    }
  });

  test("Schedule a ticket", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        title: "Schedule Test Ticket",
        type: "Issue",
        building: "Building D",
        floor: "4",
        room: "404",
        description: "This is a test ticket for schedule",
        image: [],
      });

    expect(createResponse.status).toBe(200);

    const ticketId = createResponse.body.newTicket._id;

    const work = await request(app)
      .get("/workers")
      .set("Authorization", `Bearer ${tokenUser}`);

    const workerId = work.body[0]._id;

    await request(app)
      .put(`/tickets/${ticketId}/accept`)
      .set("Authorization", `Bearer ${tokenTechnician}`);

    const scheduleResponse = await request(app)
      .put(`/tickets/${ticketId}/schedule`)
      .set("Authorization", `Bearer ${tokenTechnician}`)
      .send({
        plannedDate: new Date().toISOString(),
        extimatedTime: 2,
        worker: workerId,
      });

    expect(scheduleResponse.status).toBe(200);
  });

  test("Decline a ticket with a reason", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${tokenTechnician}`)
      .send({
        title: "Decline Test Ticket",
        type: "Issue",
        building: "Building E",
        floor: "5",
        room: "505",
        description: "This is a test ticket for decline",
        image: [],
      });

    expect(createResponse.status).toBe(200);

    const ticketId = createResponse.body.newTicket._id;

    const declineResponse = await request(app)
      .put(`/tickets/${ticketId}/decline`)
      .set("Authorization", `Bearer ${tokenTechnician}`)
      .send({
        declineReason: "Not enough information",
      });

    expect(declineResponse.status).toBe(200);
  });

  test("Accept a ticket by assigning it to you", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        title: "Accept Test Ticket",
        type: "Issue",
        building: "Building F",
        floor: "6",
        room: "606",
        description: "This is a test ticket for accept",
        image: [],
      });

    expect(createResponse.status).toBe(200);

    const ticketId = createResponse.body.newTicket._id;

    const acceptResponse = await request(app)
      .put(`/tickets/${ticketId}/accept`)
      .set("Authorization", `Bearer ${tokenTechnician}`);

    expect(acceptResponse.status).toBe(200);
  });

  //=================================================================================================
  // ALL THE FOLLOWING TESTS ARE SPECIFIC to WORKER
  //=================================================================================================

  test("Get all updates on tickets assigned to me", async () => {
    const response = await request(app)
      .get("/updates")
      .set("Authorization", `Bearer ${tokenWorker}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((update) => {
      expect(update).toHaveProperty("title");
      expect(update).toHaveProperty("type");
      expect(update).toHaveProperty("state");
    });
  });

  //=================================================================================================
  // ALL THE FOLLOWING TESTS ARE SPECIFIC to PLACE MANAGEMENT
  //=================================================================================================

  test("Create a new place", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        name: "New Place",
        floors: [
          {
            floor: "1",
            rooms: ["101", "102"],
          },
          {
            floor: "2",
            rooms: ["33", "34"],
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New Place");
  });

  test("Get all places", async () => {
    const response = await request(app).get("/places");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((place) => {
      expect(place).toHaveProperty("floors");
      place.floors.forEach((floor) => {
        expect(floor).toHaveProperty("floor");
        expect(floor).toHaveProperty("rooms");
        expect(floor.rooms).toBeInstanceOf(Array);
      });
    });
  });
});
