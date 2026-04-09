import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class AreaService {

  constructor(private api: BaseApiService) {}

  getList(params: any) {
    return this.api.get(`area?page=${params.page}&size=${params.size}`);
  }

  create(data: any) {
    return this.api.post('area', data);
  }

  update(id: number, data: any) {
    return this.api.put(`area/${id}`, data);
  }

  delete(id: number) {
    return this.api.delete(`area/${id}`);
  }
}
