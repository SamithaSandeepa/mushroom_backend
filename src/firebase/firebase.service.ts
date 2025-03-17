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

  async updateSwitchStatus(
    deviceId: string,
    switchId: number,
    status: boolean,
  ): Promise<void> {
    try {
      await this.db.ref(`devices/${deviceId}/switches/${switchId}`).set(status);
      console.log(
        `Updated switch ${switchId} for device ${deviceId} to ${status ? 'on' : 'off'}`,
      );
    } catch (error) {
      console.error('Error updating switch status:', error);
      throw error;
    }
  }

  async resetDeviceSwitches(deviceId: string): Promise<void> {
    try {
      await this.db.ref(`devices/${deviceId}`).update({
        switches: { 1: false, 2: false, 3: false, 4: false },
        serverReset: true,
      });
      console.log(`Reset switches for device ${deviceId}`);
    } catch (error) {
      console.error('Error resetting switches for device', deviceId, error);
      throw error;
    }
  }

  async getAllDevices(): Promise<any> {
    try {
      const snapshot = await this.db.ref('devices').once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching devices:', error);
      return null;
    }
  }
}
