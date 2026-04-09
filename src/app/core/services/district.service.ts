import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class DistrictService {

    constructor(private api: BaseApiService) { }

    getDistrict() {
        return this.api.get('api/get-all-district');
    }

}