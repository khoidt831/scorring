import { Component, OnInit } from '@angular/core';
import { AreaService } from 'src/app/core/services/area.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { DistrictService } from 'src/app/core/services/district.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  fullList: any[] = [];
  list: any[] = [];
  areas: any[] = [];

  originalList: any[] = [];

  searchForm: any = {
    bid: '',
    aid: null,
    name: '',
    status: null,
  };

  districts: any[] = [];
  selectedDistrict: string = '';
  
  page = 0;
  size = 10;
  total = 0;

  constructor(private service: BranchService, private areaService: AreaService) { }

  ngOnInit() {
    this.search();
    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getAll().subscribe((res: any) => {
      this.areas = res.data || res || [];
    });
  }

  paginate() {
    const start = this.page * this.size;
    const end = start + this.size;

    this.list = this.fullList.slice(start, end);
  }

  next() {
    if ((this.page + 1) * this.size < this.total) {
      this.page++;
      this.paginate();
    }
  }

  prev() {
    if (this.page > 0) {
      this.page--;
      this.paginate();
    }
  }

  get totalPages() {
    return Math.ceil(this.total / this.size) || 1;
  }

  search() {
    this.service.getList(this.searchForm).subscribe((res: any) => {

      const rawData: any[] = res.data || [];
      this.originalList = rawData;
      this.applyFilter();
    });
  }

  applyFilter() {
    let data = [...this.originalList];

    const bid = this.searchForm.bid?.trim()?.toUpperCase();
    const aid = this.searchForm.aid;
    const name = this.searchForm.name?.trim()?.toUpperCase();
    const status = this.searchForm.status;

    data = data.filter(item => {
      let ok = true;

      if (bid) {
        ok = ok && item.bid?.toUpperCase().includes(bid);
      }

      if (aid) {
        ok = ok && item.aid === aid;
      }

      if (name) {
        ok = ok && item.name?.toUpperCase().includes(name);
      }

     if (status !== null && status !== undefined && status !== '') {
  ok = ok && item.status == status;
}

      return ok;
    });

    this.fullList = data;
    this.total = data.length;

    this.page = 0;
    this.paginate();
  }

  reset() {
    this.searchForm = {
      bid: '',
      aid: null,
      name: '',
      status: null
    };

    this.applyFilter();
  }
}