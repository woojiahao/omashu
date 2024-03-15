export const envVars = {
  db_url: 'DATABASE_URL',
  test_db_url: 'TEST_DATABASE_URL',
  jwt_secret: 'JWT_SECRET',
  email_host: 'EMAIL_HOST',
  email_port: 'EMAIL_PORT',
  email_username: 'EMAIL_USERNAME',
  email_password: 'EMAIL_PASSWORD',
  client_url: 'CLIENT_URL',
  this_url: 'THIS_URL',
} as const;

export const IS_PUBLIC_KEY = 'isPublic' as const;
