import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class DistrictService {

    constructor(private api: BaseApiService) { }

    getList() {
        return this.api.post('api/get-all-district', {});
    }

}