// backend/src/device-mode/device-mode.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class DeviceModeService {
  constructor(
    private readonly mqttService: MqttService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async setDeviceMode(
    deviceId: string,
    mode: 'manual' | 'automated',
  ): Promise<void> {
    const online = await this.firebaseService.isDeviceOnline(deviceId);
    if (!online) {
      throw new HttpException('Device is offline', HttpStatus.BAD_REQUEST);
    }
    // Publish MQTT message to the deviceMode topic
    const topic = `deviceMode/${deviceId}`;
    this.mqttService.publish(topic, mode);
    // Update device mode in Firebase
    await this.firebaseService.updateDeviceMode(deviceId, mode);
  }
}
