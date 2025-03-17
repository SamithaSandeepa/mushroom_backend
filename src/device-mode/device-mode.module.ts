// backend/src/device-mode/device-mode.module.ts
import { Module } from '@nestjs/common';
import { DeviceModeController } from './device-mode.controller';
import { DeviceModeService } from './device-mode.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [MqttModule, FirebaseModule],
  controllers: [DeviceModeController],
  providers: [DeviceModeService],
  exports: [DeviceModeService],
})
export class DeviceModeModule {}
