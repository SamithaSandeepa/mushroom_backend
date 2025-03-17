// backend/src/device-mode/device-mode.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DeviceModeService } from './device-mode.service';

@Controller('deviceMode')
export class DeviceModeController {
  constructor(private readonly deviceModeService: DeviceModeService) {}

  @Post('set')
  async setDeviceMode(
    @Body() body: { deviceId: string; mode: 'manual' | 'automated' },
  ) {
    const { deviceId, mode } = body;
    try {
      await this.deviceModeService.setDeviceMode(deviceId, mode);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
