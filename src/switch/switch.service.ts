// backend/src/switch/switch.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SwitchService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async controlSwitch(
    deviceId: string,
    switchId: number,
    status: boolean,
  ): Promise<void> {
    // Validate switch ID (should be between 1 and 4)
    if (switchId < 1 || switchId > 4) {
      throw new HttpException('Invalid switch ID', HttpStatus.BAD_REQUEST);
    }
    // Ensure device is online
    const online = await this.firebaseService.isDeviceOnline(deviceId);
    if (!online) {
      throw new HttpException('Device is offline', HttpStatus.BAD_REQUEST);
    }
    // Ensure device is in manual mode
    const mode = await this.firebaseService.getDeviceMode(deviceId);
    if (mode !== 'manual') {
      throw new HttpException(
        'Switch control allowed only in manual mode',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Construct the topic: e.g., "switch/1/{deviceId}"
    const topic = `switch/${switchId}/${deviceId}`;
    // Set payload as "on" or "off" (you could also send JSON)
    const message = status ? 'on' : 'off';

    try {
      // Publish MQTT message
      this.mqttService.publish(topic, message);
      // Update the switch status in Firebase
      await this.firebaseService.updateSwitchStatus(deviceId, switchId, status);
    } catch (error) {
      throw new HttpException(
        'Failed to control switch: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
