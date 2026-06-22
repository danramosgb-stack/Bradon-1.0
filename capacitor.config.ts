import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bradon.app',
  appName: 'Bradon',
  webDir: 'dist',
  server: {
    url: 'https://bradon-1-0.onrender.com',
    cleartext: false
  }
};

export default config;
