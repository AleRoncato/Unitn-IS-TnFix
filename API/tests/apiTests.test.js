const request = require("supertest");
const app = require("../index.js");
const e = require("express");

describe("API Tests", () => {
  let token;

  beforeAll(async () => {
    // Register a new user
    await request(app).post("/register").send({
      username: "testuser",
      password: "testpassword",
      role: "user",
      email: "testuser@gmail.com",
      nome: "Test",
      cognome: "User",
    });

    await request(app).post("/register").send({
      username: "Admin",
      password: "pass123",
      role: "admin",
      email: "admin@gmail.com",
      nome: "Admin",
      cognome: "Power",
    });

    // Login to get the token
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await request(app)
      .delete("/users/testuser")
      .set("Authorization", `Bearer ${token}`);

    const admin = await request(app).post("/login").send({
      username: "Admin",
      password: "pass123",
    });

    const adminToken = admin.body.token;

    await request(app)
      .put("/test")
      .set("Authorization", `Bearer ${adminToken}`);

    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  // // AUTHENTICATION TESTS

  // test("Login with valid credentials", async () => {
  //   const response = await request(app).post("/login").send({
  //     username: "testuser",
  //     password: "testpassword",
  //   });

  //   expect(response.status).toBe(200);
  //   expect(response.body.token).toBeDefined(); // THE JWT TOKEN
  // });

  // // FAILED TEST CASES

  // test("Register with missing fields", async () => {
  //   const response = await request(app).post("/register").send({
  //     username: "incompleteuser",
  //   });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe("Tutti i campi sono obbligatori");
  // });

  // test("Login with invalid credentials", async () => {
  //   const response = await request(app).post("/login").send({
  //     username: "invaliduser",
  //     password: "invalidpassword",
  //   });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe("Utente non trovato");
  // });

  // //================================================================================================

  // // TICKETING SYSTEM TESTS

  // test("Create a new ticket", async () => {
  //   const response = await request(app)
  //     .post("/tickets")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       title: "Test Ticket",
  //       type: "Issue",
  //       building: "Building A",
  //       floor: "1",
  //       room: "101",
  //       description: "This is a test ticket",
  //       image: [],
  //     });

  //   expect(response.status).toBe(202);
  //   expect(response.body.message).toBe(
  //     "Ticket uguale già esistente, sei stato aggiunto come Follower."
  //   );
  // });

  // test("Get tickets updated after user last action", async () => {
  //   const response = await request(app)
  //     .get("/updates")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);
  // });

  // // FAILED TEST CASES

  // test("Create a ticket with missing fields", async () => {
  //   const response = await request(app)
  //     .post("/tickets")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       title: "Incomplete Ticket",
  //     });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe("Tutti i campi sono obbligatori");
  // });

  // test("Follow a non-existent ticket", async () => {
  //   const response = await request(app)
  //     .post("/follows")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ ticketId: "nonexistentticketid" });

  //   expect(response.status).toBe(500);
  //   expect(response.body.error).toBe("Errore nel seguire il ticket");
  // });

  // //================================================================================================

  // // PLACES SYSTEM TESTS

  // test("Get places", async () => {
  //   const response = await request(app).get("/places");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);
  // });

  // test("Create a new place", async () => {
  //   const response = await request(app)
  //     .post("/places")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       name: "New Place",
  //       floors: [
  //         {
  //           floor: "1",
  //           rooms: ["101", "102"],
  //         },
  //         {
  //           floor: "2",
  //           rooms: ["33", "34"],
  //         },
  //       ],
  //     });

  //   expect(response.status).toBe(201);
  //   expect(response.body.name).toBe("New Place");
  // });

  // test("Access protected route without token", async () => {
  //   const response = await request(app).get("/updates");

  //   expect(response.status).toBe(401);
  //   expect(response.body.error).toBe("Accesso negato");
  // });

  //=================================================================================================
  // Niche and Interesting Test Cases
  //=================================================================================================

  test("Register with existing username", async () => {
    const response = await request(app).post("/register").send({
      username: "testuser",
      password: "anotherpassword",
      role: "user",
      email: "anotheremail@gmail.com",
      nome: "Another",
      cognome: "User",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username già esistente");
  });

  // to change
  test("Create a ticket and then update its state", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update Test Ticket",
        type: "Issue",
        building: "Building B",
        floor: "2",
        room: "202",
        description: "This is a test ticket for update",
        image: [],
      });

    expect(createResponse.status).toBe(201);
    const ticket = request(app)
      .get("/updates")
      .set("Authorization", `Bearer ${token}`);

    const ticketId = ticket.body[0]._id;

    console.log(ticketId);

    const updateResponse = await request(app)
      .put(`/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        state: "In risoluzione",
        inizio: new Date().toISOString(),
      });

    expect(updateResponse.status).toBe(403);
  });

  test("Delete a ticket created by the user", async () => {
    await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Delete Test Ticket",
        type: "Issue",
        building: "Building C",
        floor: "3",
        room: "303",
        description: "This is a test ticket for delete",
        image: [],
      });

    const ticket = request(app)
      .get("/updates")
      .set("Authorization", `Bearer ${token}`);

    console.log(ticket.body);

    const ticketId = ticket.body[0]._id;

    const deleteResponse = await request(app)
      .delete(`/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Ticket eliminato con successo");
  });

  test("Get tickets with pagination", async () => {
    const response = await request(app)
      .get("/tickets/In accettazione?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.tickets).toBeInstanceOf(Array);
    expect(response.body.tickets.length).toBeLessThanOrEqual(2);
  });

  test("Schedule a ticket", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Schedule Test Ticket",
        type: "Issue",
        building: "Building D",
        floor: "4",
        room: "404",
        description: "This is a test ticket for schedule",
        image: [],
      });

    expect(createResponse.status).toBe(201);
    const ticketId = createResponse.body._id;

    const scheduleResponse = await request(app)
      .put(`/tickets/${ticketId}/schedule`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        plannedDate: new Date().toISOString(),
        extimatedTime: 2,
        worker: "workerId",
      });

    expect(scheduleResponse.status).toBe(200);
    expect(scheduleResponse.body.message).toBe(
      "Ticket programmato con successo"
    );
  });

  test("Decline a ticket with a reason", async () => {
    const createResponse = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Decline Test Ticket",
        type: "Issue",
        building: "Building E",
        floor: "5",
        room: "505",
        description: "This is a test ticket for decline",
        image: [],
      });

    expect(createResponse.status).toBe(201);
    const ticketId = createResponse.body._id;

    const declineResponse = await request(app)
      .put(`/tickets/${ticketId}/decline`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        declineReason: "Not enough information",
      });

    expect(declineResponse.status).toBe(200);
    expect(declineResponse.body.message).toBe("Ticket rifiutato con successo");
  });

  // Places API Tests

  test("Post a new place", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Place",
        floors: [
          {
            floor: "1",
            rooms: ["101", "102"],
          },
          {
            floor: "2",
            rooms: ["201", "202"],
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test Place");
  });

  test("Get all places", async () => {
    const response = await request(app)
      .get("/places")
      .set("Authorization", `Bearer ${token}`);

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
