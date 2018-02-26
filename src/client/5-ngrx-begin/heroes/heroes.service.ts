// Clean Ngrx version
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest, finalize, take, tap } from 'rxjs/operators';

import { HeroesDataService } from '../data-services';
import { Hero, ToastService } from '../core';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

@Injectable()
export class HeroesService {

  constructor(
    private heroesDataService: HeroesDataService,
    private store: Store<fromStore.EntityCacheState>,
    private toastService: ToastService
  ) {
    this.createSelectors$();
    this.wireFilteredEntities();
  }

  // region Queries

  /** live list of cached Heroes */
  entities$: Observable<Hero[]>;

  /** Entities filtered by those criteria */
  filteredEntities$: Observable<Hero[]>;

  /** User's filter pattern */
  filterObserver: Observer<string>;

  /** true when getting all the entities */
  loading$: Observable<boolean>;

  createSelectors$() {
    const selectors$ = fromStore.createHeroesSelectors$(this.store);
    this.entities$ = selectors$.heroes$;
    this.loading$ = selectors$.loading$;
  }

  // endregion Queries

  // region CRUD Commands

  /** Get all heroes with ngrx */
  getAll() {
    // Create request action and dispatch
    const action = new fromStore.LoadHeroes();
    this.store.dispatch(action);
  }

  /** Add entity to the database. Update entities$. */
  add(entity: Hero): void {
    this.toastService.openSnackBar('Not implemented yet', 'Add');
  }

  /** Delete entity-by-id from the database. Update entities$. */
  delete(id: number | string ): void {
    this.toastService.openSnackBar('Not implemented yet', 'Delete');
  }

  /** Update the entity in the database.  Update entities$. */
  update(entity: Hero): void {
    this.toastService.openSnackBar('Not implemented yet', 'Update');
  }
  // endregion CRUD Commands

  // region wireFilteredEntities
  wireFilteredEntities() {
    const filterObserver = new BehaviorSubject('');
    this.filterObserver = filterObserver;
    this.filteredEntities$ = filterObserver.pipe(
      combineLatest(this.entities$, this.filterProjector)
    );
  }

  protected filterProjector(filterValue: string, entities: Hero[]) {
    const regEx = filterValue ? new RegExp(filterValue, 'i') : undefined;
    return regEx ?
      entities.filter((e: any) => e.name && e.name.match(regEx)) :
      entities;
  }
  // endregion wireFilteredEntities
}