import request from 'supertest';
import { jest } from '@jest/globals';
import tokenManager from '../../utils/tokenManager.js';

const supabaseMock = { from: jest.fn() };
jest.unstable_mockModule('../../config/supabase.js', () => ({
  default: supabaseMock,
  supabase: supabaseMock,
  supabaseAdmin: null,
}));

let app;

beforeAll(async () => {
  ({ default: app } = await import('../../app.js'));
});

describe('HTTP API security integration', () => {
  it('serves the health endpoint with security headers', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('rejects profile access without authentication', async () => {
    const response = await request(app).get('/api/users/2');

    expect(response.status).toBe(401);
  });

  it('blocks a regular user from reading or changing another profile', async () => {
    const token = tokenManager.generateAccessToken({
      id_user: 1,
      email: 'student@example.com',
      role: 'user',
    });

    const readResponse = await request(app)
      .get('/api/users/2')
      .set('Authorization', `Bearer ${token}`);
    const updateResponse = await request(app)
      .put('/api/users/2')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Changed by another user' });

    expect(readResponse.status).toBe(403);
    expect(updateResponse.status).toBe(403);
  });

  it('rejects malformed pagination queries before reaching the database', async () => {
    const response = await request(app).get('/api/competitions?page=-1');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed.');
  });

  it('does not accept an access token as a refresh token', async () => {
    const accessToken = tokenManager.generateAccessToken({
      id_user: 1,
      email: 'student@example.com',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: accessToken });

    expect(response.status).toBe(401);
  });
});
