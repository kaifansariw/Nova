export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'nova_team_super_secret_jwt_key_2026_modern_secure',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d'
};
