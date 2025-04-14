import { PlaceType } from '../../shared/enums/place-type.enum';

export class CreatePlaceDto {
  name: string;
  description: string;
  address: string;
  type: PlaceType;
  cityId: number;
  image: string;
}
