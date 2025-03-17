// backend/src/firebase/reset-switches.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class ResetSwitchesService implements OnModuleInit {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly mqttService: MqttService,
  ) {}

  async onModuleInit() {
    console.log('Resetting switches on startup...');
    const devices = await this.firebaseService.getAllDevices();
    if (devices) {
      for (const deviceId in devices) {
        // Reset switches for the device in Firebase and mark serverReset
        await this.firebaseService.resetDeviceSwitches(deviceId);
        // Publish MQTT messages for each switch so that the device is notified
        for (let switchId = 1; switchId <= 4; switchId++) {
          const topic = `switch/${switchId}/${deviceId}`;
          this.mqttService.publish(topic, 'off');
          console.log(`Published reset message on ${topic}`);
        }
      }
    } else {
      console.log('No devices found to reset switches.');
    }
  }
}
