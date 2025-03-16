// backend/src/mqtt/mqtt.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { FirebaseService } from '../firebase/firebase.service';
import { IClientOptions, MqttProtocol } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    // Connect to your MQTT broker (HiveMQ in this case)
    const mqttOptions: IClientOptions = {
      protocol: 'mqtts' as MqttProtocol,
      host: '93955ed70ede4f37bfa98ccc1f29f19c.s1.eu.hivemq.cloud',
      port: 8883,
      username: 'mushroom',
      password: 'Mushroom1',
    };

    this.client = mqtt.connect(mqttOptions);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to heartbeat and other topics
      this.client.subscribe('heartbeat/+', (err) => {
        if (err) {
          console.error('Failed to subscribe to heartbeat topic:', err);
        } else {
          console.log('Subscribed to heartbeat topics');
        }
      });
      this.client.subscribe('indoor/+', (err) => {
        if (err) console.error(err);
      });
      this.client.subscribe('outdoor/+', (err) => {
        if (err) console.error(err);
      });
      this.client.subscribe('deviceMode/+', (err) => {
        if (err) console.error(err);
      });
    });

    this.client.on('message', (topic, message) => {
      if (topic.startsWith('heartbeat/')) {
        const deviceId = topic.split('/')[1];
        const heartbeatTimestamp = Date.now();
        console.log(
          `Heartbeat received from device ${deviceId} at ${heartbeatTimestamp}`,
        );
        this.firebaseService.updateDeviceHeartbeat(
          deviceId,
          heartbeatTimestamp,
        );
      }
      console.log(`Message received on topic ${topic}: ${message.toString()}`);
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}
