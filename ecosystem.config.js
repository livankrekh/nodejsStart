module.exports = {
  apps : [{
    name      : 'API',
    script    : 'main.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'unit-hacker',
      host : 'localhost',
      ref  : 'origin/new',
      repo : '.',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
