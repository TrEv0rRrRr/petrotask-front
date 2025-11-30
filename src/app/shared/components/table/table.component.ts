import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  cloneDeep,
  filter as filterLodash,
  get,
  isEqual,
  isUndefined,
  map,
} from 'lodash-es';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  Cell,
  Columns,
  Sort,
  SortDirection,
  filterPredicate,
  sortingDataAccessor,
} from './table.models';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CallbackPipe } from '../../pipes/callback.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    MatButtonModule,
    CallbackPipe,
    TranslatePipe,
    MatProgressBarModule
  ],
})
export class TableComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{

  @ViewChild(MatPaginator, { static: true }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;


  filteredDataSource = new MatTableDataSource();
  pageSize!: number;
  resultsLength = 0;
  defaultSort!: Sort;
  onDestroy = new Subject<void>();
  itemsBeingDeleted = new Set<number>();

  skeletonRowsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  alreadyRestored = false;
  @Input() OverflowY = false;
  @Input() restoreParams = false;
  @Input() selectable = true;
  @Input() set skeletonRows(value: number) {
      this.skeletonRowsArray = Array(value).fill(1);
  }
  @Input() columns: Columns[] = [];
  @Input() customColumns?: TemplateRef<any>;
  @Input() sort: Sort = { active: '', direction: SortDirection.DESC };
  @Input() dataSource: any[] = [];
  @Input() showPaginator = true;
  @Input() loading = false;
  @Input() update?: Subject<void>;
  @Input() rowClass?: (row: any) => string;
  @Input() fixedSize?: boolean = false;
  @Input() fixedHeight?: string = '400px';


  @Output() totalChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() timeChange = new EventEmitter<any>();
  @Output() equipmentChange = new EventEmitter<any>();
  @Output() teamChange = new EventEmitter<any>();
  @Output() deleteChange = new EventEmitter<number>();
  @Output() selecteChange = new EventEmitter<any>();
  @Output() checkboxChange = new EventEmitter<any>();

  /**
   * Constructor
   */
  constructor(

  ) {}

  ngOnInit(): void {
      this.defaultSort = cloneDeep(this.sort);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['columns'] && this.columns) {
          this.columns = filterLodash(this.columns, [
              'hide.visible',
              true,
          ]) as Columns[];
      }

      if (changes['dataSource'] && this.dataSource) {
          setTimeout(() => {
              this.setData();
              this.itemsBeingDeleted.clear();
          });
      }

      if (
          !changes['sort']?.firstChange &&
          !isEqual(
              changes['sort']?.currentValue,
              changes['sort']?.previousValue
          )
      ) {
          this.matSort.active = this.sort.active;
          this.matSort.direction = this.sort.direction;
          this.matSort.sortChange.emit(this.matSort);

          if (
              this.dataSource
          ) {
              this.matPaginator.firstPage();
          }
      }
  }

  ngAfterViewInit(): void {
      this.initEvents();

      if (
          !isUndefined(this.dataSource)
      ) {
          this.filteredDataSource.sort = this.matSort;

          if (this.showPaginator && this.matPaginator) {
              this.filteredDataSource.paginator = this.matPaginator;
          }

          this.filteredDataSource.sortingDataAccessor = (
              data: any,
              sortHeaderId: string
          ) => {
              return sortingDataAccessor(data, sortHeaderId);
          };

          this.filteredDataSource.filterPredicate = (
              data: any,
              filter: string
          ) => {
              return filterPredicate(data, filter);
          };
      }
  }

  ngOnDestroy(): void {
      this.onDestroy.next();
      this.onDestroy.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * init events
   */
  initEvents(): void {
      this.matSort.sortChange
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
              const sort: Sort = {
                  active: this.matSort.direction
                      ? this.matSort.active
                      : this.defaultSort.active,
                  direction:
                      (this.matSort.direction as SortDirection) ||
                      this.defaultSort.direction,
              };

              this.sortChange.emit(sort);
          });

      if (this.showPaginator && this.matPaginator) {
          this.matPaginator.page
              .pipe(takeUntil(this.onDestroy))
              .subscribe(() => {
              });
      }
  }

  /**
   * set data
   */
  setData(): void {
      const data = this.dataSource;

      // Primero establecemos los datos
      this.filteredDataSource.data = data!;
      this.resultsLength = data!.length;
      console.log(this.filteredDataSource);
      console.log(this.columns);

      if (this.showPaginator) {
          // Configuramos el paginador
          this.filteredDataSource.paginator = this.matPaginator;

          // Si tiene tamaño fijo, ajustamos el tamaño de página después de un pequeño delay
          if (this.fixedSize && data) {
              setTimeout(() => {
                  this.matPaginator.pageSize = data.length;
                  this.filteredDataSource.paginator = this.matPaginator;
              });
          }
      }

      this.totalChange.emit(this.resultsLength);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * set pagination size
   * @param value type number
   */
  setPageSize(value: number): void {
      this.matPaginator.pageSize = value;
      if (this.dataSource) {
          this.setData();
      }
  }

  getHeader(value: Columns[]): string[] {
      return map(value, 'header.key');
  }

   getCell(value: any, labels: Cell[] | string): string {
      const response: string[] = [];

      switch (typeof labels) {
          case 'string':
              return get(value, labels);
          case 'object':
              labels.forEach((label) => {
                  response.push(
                      [
                          label.before ? label.before : '',
                          get(value, label.value),
                          label.after ? label.after : '',
                      ].join('')
                  );
              });

              return response.join(' ');
      }
  }

  onSelectRow(data: any): void {
      this.selecteChange.emit(data);
  }

  onCheckboxChange(data: any): void{
      this.checkboxChange.emit(data);
  }

  deleteDialog(data: any): void {
    this.deleteChange.emit(data);
  }
}
