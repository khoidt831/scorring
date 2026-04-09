import { Component, OnInit } from '@angular/core';
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

  searchForm: any = {
    bid: '',
    aid: '',
    name: '',
    status: ''
  };

  districts: any[] = [];
  selectedDistrict: string = '';

  page = 0;
  size = 10;
  total = 0;

  constructor(private service: BranchService, private districtService: DistrictService) { }

  ngOnInit() {
    this.load();
    this.loadDistrict();
  }

  loadDistrict() {
    this.districtService.getDistrict().subscribe((res: any) => {
      this.districts = res.data || [];
    });
  }

  load() {
    this.service.getList().subscribe((res: any) => {
      this.fullList = res.data || [];
      this.total = this.fullList.length;

      this.paginate();
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

  delete(id: number) {
    if (confirm('Xóa?')) {
      this.service.delete(id).subscribe(() => {
        this.fullList = this.fullList.filter(x => x.id !== id);
        this.total = this.fullList.length;

        if (this.page * this.size >= this.total) {
          this.page = Math.max(this.page - 1, 0);
        }

        this.paginate();
      });
    }
  }

  get totalPages() {
    return Math.ceil(this.total / this.size);
  }

  search() {
    const payload = {
      ...this.searchForm,
      page: this.page,
      size: this.size
    };

    this.service.getList(payload).subscribe((res: any) => {
      this.list = res.data || [];
      this.total = res.total || 0;
    });
  }

  reset() {
    this.searchForm = {
      bid: '',
      aid: '',
      name: '',
      status: ''
    };
    this.page = 1;
    this.search();
  }
}