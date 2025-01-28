const request = require("supertest");
const app = require("../index.js");

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

    // Login to get the token
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });

    token = response.body.token;
  });

  afterAll(async () => {

    // Cleanup: delete the test user
    await request(app)
      .delete("/users/testuser")
      .set("Authorization", `Bearer ${token}`);


    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  // AUTHENTICATION TESTS

  test("Register a new user", async () => {
    const response = await request(app).post("/register").send({
      username: "newuser",
      password: "newpassword",
      role: "user",
      email: "usernew@gmail.com",
      nome: "New",
      cognome: "User",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Utente registrato con successo");

    // Cleanup: delete the new user
    await request(app)
      .delete("/users/newuser")
      .set("Authorization", `Bearer ${token}`);
  });

  test("Login with valid credentials", async () => {
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); // THE JWT TOKEN
  });

  // FAILED TEST CASES

  test("Register with missing fields", async () => {
    const response = await request(app).post("/register").send({
      username: "incompleteuser",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Tutti i campi sono obbligatori");
  });

  test("Login with invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      username: "invaliduser",
      password: "invalidpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Utente non trovato");
  });

  //================================================================================================

  // TICKETING SYSTEM TESTS

  test("Create a new ticket", async () => {
    const response = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Ticket",
        type: "Issue",
        building: "Building A",
        floor: "1",
        room: "101",
        description: "This is a test ticket",
        image: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Ticket uguale già esistente, sei stato aggiunto come Follower."
    );
  });

  // test("Follow a ticket", async () => {
  //   const ticketResponse = await request(app)
  //     .get("/tickets")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       state: "In accettazione",
  //     });

  //   const ticketId = ticketResponse.body._id;

  //   const followResponse = await request(app)
  //     .post("/follows")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({ ticketId });

  //   expect(followResponse.status).toBe(201);
  //   expect(followResponse.body).toBeDefined();
  // });

  test("Get tickets updated after user last action", async () => {
    const response = await request(app)
      .get("/updates")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // FAILED TEST CASES

  test("Create a ticket with missing fields", async () => {
    const response = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Incomplete Ticket",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Tutti i campi sono obbligatori");
  });

  test("Follow a non-existent ticket", async () => {
    const response = await request(app)
      .post("/follows")
      .set("Authorization", `Bearer ${token}`)
      .send({ ticketId: "nonexistentticketid" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Errore nel seguire il ticket");
  });

  //================================================================================================

  // PLACES SYSTEM TESTS

  test("Get places", async () => {
    const response = await request(app).get("/places");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("Create a new place", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
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

  test("Access protected route without token", async () => {
    const response = await request(app).get("/updates");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Accesso negato");
  });
});
