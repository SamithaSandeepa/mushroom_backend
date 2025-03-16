// backend/src/firebase/offline-check.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FirebaseService } from './firebase.service';

@Injectable()
export class OfflineCheckService {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Runs every minute
  @Cron('*/60 * * * * *')
  async handleCron() {
    await this.firebaseService.checkOfflineDevices(60000); // threshold 60 seconds
  }
}
