//mqttController.mjs
import mqtt from 'mqtt';
import TambakData from '../models/TambakData.mjs';
import dotenv from 'dotenv';

dotenv.config();

class MQTTController {
  constructor() {
    this.client = null;
    this.connect();
  }

  connect() {
    this.client = mqtt.connect({
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
      reconnectPeriod: 5000 // Reconnect every 5 seconds if connection is lost
    });

    this.client.on('connect', () => {
      console.log('Successfully connected to MQTT broker');
      this.subscribeToTopic();
    });

    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('error', this.handleError.bind(this));
    this.client.on('close', this.handleClose.bind(this));
    this.client.on('offline', this.handleOffline.bind(this));
  }

  subscribeToTopic() {
    this.client.subscribe(process.env.TOPIC, { qos: 1 }, (err) => {
      if (err) {
        console.error('Failed to subscribe to topic:', err);
      } else {
        console.log(`Subscribed to topic: ${process.env.TOPIC}`);
      }
    });
  }

  async handleMessage(topic, message) {
    try {
      console.log(`Received message on topic: ${topic}`);
      const payload = JSON.parse(message.toString());

      const data = {
        time: new Date(payload[process.env.PAYLOAD_DIPASENA_TS]),
        suhu_air_permukaan: parseFloat(payload[process.env.PAYLOAD_DIPASENA_SUHU_AIR_ATAS]) || 0,
        suhu_air_dasar: parseFloat(payload[process.env.PAYLOAD_DIPASENA_SUHU_AIR_BAWAH]) || 0,
        suhu_ruang: parseFloat(payload[process.env.PAYLOAD_DIPASENA_SUHU_RUANG]) || 0,
        salinitas: parseFloat(payload[process.env.PAYLOAD_DIPASENA_SALINITAS]) || 0,
        oxygen: parseFloat(payload[process.env.PAYLOAD_DIPASENA_DO]) || 0,
        ph: parseFloat(payload[process.env.PAYLOAD_DIPASENA_PH]) || 0,
        amonia: parseFloat(payload[process.env.PAYLOAD_DIPASENA_AMONIA]) || 0
      };

      // Validate data before saving
      if (isNaN(data.time.getTime())) {
        throw new Error('Invalid timestamp in payload');
      }

      const savedData = await TambakData.insert(data);
      console.log('Data successfully saved:', savedData);
    } catch (error) {
      console.error('Error processing MQTT message:', error.message);
      // You might want to implement retry logic or dead-letter queue here
    }
  }

  handleError(error) {
    console.error('MQTT client error:', error);
    // Implement reconnection logic if needed
  }

  handleClose() {
    console.log('MQTT connection closed');
    // Implement reconnection logic
    setTimeout(() => this.connect(), 5000);
  }

  handleOffline() {
    console.log('MQTT client offline');
  }

  // Expose client for external use if needed
  getClient() {
    return this.client;
  }
}

// Singleton pattern to ensure single MQTT connection
const mqttController = new MQTTController();
export default mqttController;