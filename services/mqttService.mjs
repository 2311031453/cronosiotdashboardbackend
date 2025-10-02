mqttService.js
import mqtt from 'mqtt';
import TambakData from '../models/TambakData.mjs';
import dotenv from 'dotenv';

dotenv.config();

class MQTTService {
  constructor() {
    this.client = mqtt.connect({
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe(process.env.TOPIC, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${process.env.TOPIC}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
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

        await TambakData.insert(data);
        console.log('Data inserted:', data);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
    });
  }
}

const mqttService = new MQTTService();
export default mqttService;