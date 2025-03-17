// backend/src/switch/switch.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SwitchService } from './switch.service';

@Controller('switch')
export class SwitchController {
  constructor(private readonly switchService: SwitchService) {}

  @Post('control')
  async controlSwitch(
    @Body() body: { deviceId: string; switchId: number; status: boolean },
  ) {
    const { deviceId, switchId, status } = body;
    try {
      await this.switchService.controlSwitch(deviceId, switchId, status);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
