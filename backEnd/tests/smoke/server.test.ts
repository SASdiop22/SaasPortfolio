import request from 'supertest';
import app from '../../src/server';

describe('Server smoke test', () => {
  it('GET /public/u/nonexistent returns 404', async () => {
    const res = await request(app).get('/public/u/nonexistent_user_xyz');
    expect(res.status).toBe(404);
  });

  it('POST /api/auth/login without body returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/me without cookie returns 401', async () => {
    const res = await request(app).get('/api/me');
    expect(res.status).toBe(401);
  });
});