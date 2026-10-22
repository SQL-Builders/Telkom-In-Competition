import { jest } from '@jest/globals';
import { registerSchema } from '../../validations/authValidation.js';
import { authorizeSelfOrAdmin } from '../../middleware/authMiddleware.js';
import { validateUploadedFile } from '../../middleware/uploadMiddleware.js';
import { buildCompetitionSearchFilter } from '../../services/competitionService.js';

describe('Security rules', () => {
  it('strips a caller-supplied admin role from public registration data', () => {
    const result = registerSchema.safeParse({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'admin',
    });

    expect(result.success).toBe(true);
    expect(result.data.role).toBeUndefined();
  });

  it('allows self access and denies cross-user access', () => {
    const middleware = authorizeSelfOrAdmin();
    const next = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    middleware({ user: { id_user: 7, role: 'user' }, params: { id: '8' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();

    middleware({ user: { id_user: 7, role: 'user' }, params: { id: '7' } }, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('checks uploaded file bytes against the declared MIME type', () => {
    const next = jest.fn();
    const fakePdf = {
      file: { mimetype: 'application/pdf', buffer: Buffer.from('%PDF-1.7') },
    };
    validateUploadedFile(fakePdf, {}, next);
    expect(next).toHaveBeenCalledWith();

    const spoofedPdf = {
      file: { mimetype: 'application/pdf', buffer: Buffer.from('not a PDF') },
    };
    validateUploadedFile(spoofedPdf, {}, next);
    expect(next.mock.calls[1][0]).toMatchObject({ statusCode: 400 });
  });

  it('quotes search text so it cannot add PostgREST filter clauses', () => {
    const filter = buildCompetitionSearchFilter('hack",status.eq.active');

    expect(filter).toBe('nama_lomba.ilike."%hack\\",status.eq.active%",penyelenggara.ilike."%hack\\",status.eq.active%"');
  });
});
