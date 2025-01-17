const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

describe('API Tests', () => {
  let token;

  beforeAll(async () => {
    // Register a new user
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        role: 'user',
      });

    // Login to get the token
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    token = response.body.token;
  });

  afterAll(async () => {
    // Cleanup: delete the test user
    await request(app)
      .delete('/users/testuser')
      .set('Authorization', `Bearer ${token}`);
  });

  test('Register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'newuser',
        password: 'newpassword',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utente registrato con successo');
  });

  test('Login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); // THE JWT TOKEN
  });

  test('Create a new ticket', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Ticket',
        type: 'Issue',
        building: 'Building A',
        floor: '1',
        room: '101',
        description: 'This is a test ticket',
        image: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Ticket creato con successo.');
  });

  test('Get tickets updated after user last action', async () => {
    const response = await request(app)
      .get('/tickets/updates')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('Follow a ticket', async () => {
    const ticketResponse = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Follow Ticket',
        type: 'Issue',
        building: 'Building B',
        floor: '2',
        room: '202',
        description: 'This is a follow ticket',
        image: [],
      });

    const ticketId = ticketResponse.body._id;

    const followResponse = await request(app)
      .post('/follows')
      .set('Authorization', `Bearer ${token}`)
      .send({ ticketId });

    expect(followResponse.status).toBe(201);
    expect(followResponse.body).toBeDefined();
  });

  test('Get places', async () => {
    const response = await request(app).get('/places');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('Create a new place', async () => {
    const response = await request(app)
      .post('/places')
      .send({
        name: 'New Place',
        floors: [
          {
            floor: '1',
            rooms: ['101', '102'],
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Place');
  });

  // Failed test cases
  test('Register with missing fields', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'incompleteuser',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Tutti i campi sono obbligatori');
  });

  test('Login with invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'invaliduser',
        password: 'invalidpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Utente non trovato');
  });

  test('Create a ticket with missing fields', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Incomplete Ticket',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Tutti i campi sono obbligatori');
  });

  test('Access protected route without token', async () => {
    const response = await request(app).get('/tickets/updates');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Accesso negato');
  });

  test('Follow a non-existent ticket', async () => {
    const response = await request(app)
      .post('/follows')
      .set('Authorization', `Bearer ${token}`)
      .send({ ticketId: 'nonexistentticketid' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Errore nel seguire il ticket');
  });
});
