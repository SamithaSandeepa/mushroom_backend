// backend/src/mqtt/mqtt.module.ts
import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  providers: [MqttService, FirebaseService],
  exports: [MqttService],
})
export class MqttModule {}
