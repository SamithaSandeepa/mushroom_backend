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
        const mode = devices[deviceId].mode;
        // Only reset if in manual mode
        if (mode === 'manual') {
          await this.firebaseService.resetDeviceSwitches(deviceId);
          for (let switchId = 1; switchId <= 4; switchId++) {
            const topic = `switch/${switchId}/${deviceId}`;
            this.mqttService.publish(topic, 'off');
            console.log(`Published reset message on ${topic}`);
          }
        }
      }
    } else {
      console.log('No devices found to reset switches.');
    }
  }
}
