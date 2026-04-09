import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class BranchService {

    constructor(private api: BaseApiService) { }

    getList() {
        return this.api.post('api/admin/search-branch', {});
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