import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';
import { FirebaseModule } from './firebase/firebase.module';
import { OfflineCheckService } from './firebase/offline-check.service';
import { SwitchModule } from './switch/switch.module';
import { ResetSwitchesService } from './switch/reset-switches.service';

@Module({
  imports: [
    AuthModule,
    MqttModule,
    FirebaseModule,
    SwitchModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, OfflineCheckService, ResetSwitchesService],
})
export class AppModule {}
