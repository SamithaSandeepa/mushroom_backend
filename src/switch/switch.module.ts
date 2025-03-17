// backend/src/switch/switch.module.ts
import { Module } from '@nestjs/common';
import { SwitchController } from './switch.controller';
import { SwitchService } from './switch.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [MqttModule, FirebaseModule],
  controllers: [SwitchController],
  providers: [SwitchService],
  exports: [SwitchService],
})
export class SwitchModule {}
