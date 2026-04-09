import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class BranchService {

    constructor(private api: BaseApiService) { }

    getList(params?: any) {
        const payload: any = {};

        const bid = params?.bid?.trim();
        const aid = params?.aid?.trim();
        const name = params?.name?.trim();
        const status = params?.status;

        if (bid) payload.pv_bid = bid;
        if (aid) payload.pv_aid = aid;
        if (name) payload.pv_name = name;
        if (status !== '' && status !== null && status !== undefined) {
            payload.pv_status = status;
        }

        return this.api.post('api/admin/search-branch', payload);
    }

    create(data: any) {
        return this.api.post('branch', data);
    }

    update(id: number, data: any) {
        return this.api.put(`branch/${id}`, data);
    }

    delete(id: number) {
        return this.api.delete(`branch/${id}`);
    }

    getById(id: number) {
        return this.api.get(`branch/${id}`);
    }
}