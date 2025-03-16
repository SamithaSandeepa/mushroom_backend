// backend/src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import { admin } from './firebase.admin';

@Injectable()
export class FirebaseService {
  private db = admin.database();

  async updateDeviceHeartbeat(
    deviceId: string,
    timestamp: number,
  ): Promise<void> {
    try {
      await this.db.ref(`devices/${deviceId}`).update({
        lastHeartbeat: timestamp,
        online: true,
      });
      console.log(`Updated heartbeat for device ${deviceId}`);
    } catch (error) {
      console.error('Error updating device heartbeat:', error);
    }
  }

  async checkOfflineDevices(threshold: number = 60000): Promise<void> {
    try {
      const snapshot = await this.db.ref('devices').once('value');
      const devices = snapshot.val();
      const now = Date.now();
      for (const deviceId in devices) {
        const device = devices[deviceId];
        if (device.lastHeartbeat && now - device.lastHeartbeat > threshold) {
          await this.db.ref(`devices/${deviceId}`).update({ online: false });
          console.log(`Marked device ${deviceId} as offline`);
        }
      }
    } catch (error) {
      console.error('Error checking offline devices:', error);
    }
  }
}
