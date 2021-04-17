import {
  IsBoolean,
  IsString,
  IsEnum,
  ValidateNested,
  ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";
import { DiabetesMetric, NightscoutBloodGlucoseUnit } from "../enums";

export const returnNightscoutValidationEndpointResponseUrlType = () =>
  NightscoutValidationEndpointResponseUrl;
export const returnNightscoutValidationEndpointResponseTokenType = () =>
  NightscoutValidationEndpointResponseToken;
export const returnNightscoutValidationEndpointResponseNightscoutType = () =>
  NightscoutValidationEndpointResponseNightscout;

export const glucoseUnitValidationCondition = (o: any) => o.glucoseUnit !== "";

export class NightscoutValidationEndpointResponseUrl {
  @IsBoolean()
  isValid!: boolean;

  @IsString()
  parsed!: string;

  @IsBoolean()
  pointsToNightscout!: boolean;
}

export class NightscoutValidationEndpointResponseToken {
  @IsBoolean()
  isValid!: boolean;

  @IsString()
  parsed!: string;
}

export class NightscoutValidationEndpointResponseNightscout {
  @ValidateIf(glucoseUnitValidationCondition)
  @IsEnum(NightscoutBloodGlucoseUnit)
  glucoseUnit!: NightscoutBloodGlucoseUnit;

  @IsString()
  minSupportedVersion!: string;

  @IsString()
  version!: string;
}

export class NightscoutValidationEndpointResponseDto {
  @Type(returnNightscoutValidationEndpointResponseUrlType)
  @ValidateNested()
  url!: NightscoutValidationEndpointResponseUrl;

  @Type(returnNightscoutValidationEndpointResponseTokenType)
  @ValidateNested()
  token!: NightscoutValidationEndpointResponseToken;

  @Type(returnNightscoutValidationEndpointResponseNightscoutType)
  @ValidateNested()
  nightscout!: NightscoutValidationEndpointResponseNightscout;

  @IsEnum(DiabetesMetric, { each: true })
  discoveredMetrics!: DiabetesMetric[];
}
