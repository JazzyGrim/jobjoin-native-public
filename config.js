// App Configuration File
const env = process.env.NODE_ENV; // Get the ENV state ( DEV / PROD )

const dev = {
  server: {
    url: process.env.DEV_SERVER_URL || 'http://192.168.1.2:4000/',
  },
};

const prod = {
  server: {
    url: process.env.PROD_SERVER_URL || 'http://192.168.1.2:4000/',
  },
};

const config = {
  dev,
  prod,
};

export default config['dev']; // Export the required config
