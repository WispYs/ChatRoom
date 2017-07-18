module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Socket',
      script    : 'index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
    
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'wisper',
      host : '192.30.252.154',
      ref  : 'origin/master',
      repo : 'git@github.com:WispYs/ChatRoom.git',
      path : '/ChatRoom',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
	  
    }
  }
};
