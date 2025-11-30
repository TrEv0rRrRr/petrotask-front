/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormControl } from '@angular/forms';
import { get, omit, pick } from 'lodash-es';

/**
 * @property header { Header } - data to display in header
 * @property cell { Cell[] | string } - data to display in cell
 * @property type { 'text' | 'template' | 'delete_option' }
 * @property sortable { boolean } - sortable field
 * @property hide? { Hide } - data to show in hide
 * @property settings? { Hide } - Transforms the data to display
 */
export interface Columns {
    header: Header;
    cell: Cell[] | string;
    type: ColumnTypes;
    sortable: boolean;
    hide?: Hide;
    settings?: {
        disable?: (row: any) => boolean;
        tooltip: (row: any) => string;
        hidden?: (row: any) => boolean;
        icon?: string;
        label?: string;
        action?: (row: any) => void;
    };
    selectorConfig?: {
        selectControl?: FormControl[];
        label?: string;
        cleanable?: boolean;
        multiple?: boolean;
        searchable?: boolean;
        fieldConfig?: any;
        dataSource?: any[];
    };
}

/**
 * @property key
 * @property label
 */
export interface Header {
    key: string;
    label: string;
}

/**
 * @property before
 * @property value
 * @property after
 */
export interface Cell {
    before?: string;
    value: string;
    after?: string;
}

export type ColumnTypes =
    | 'text'
    | 'template'
    | 'delete_option'
    | 'edit_option'
    | 'priority'
    | 'date'
    | 'status'
    | 'avatar'
    | 'translate'
    | 'addTeam'
    | 'addEquipment'
    | 'addTime'
    | 'checkbox'
    | 'details'
    | 'button';

/**
 * @property label
 * @property visible
 */
export interface Hide {
    label: string;
    visible: boolean;
}


/**
 * @property active
 * @property direction
 */
export interface Sort {
    active: string;
    direction: SortDirection;
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

/**
 *
 * @param data - object to evaluate
 * @param sortHeaderId - id of the header to sort
 * @returns
 */
export function sortingDataAccessor(data: any, sortHeaderId: string): any {
    return get(data, sortHeaderId, null);
}

/**
 *
 * @param object - object to evaluate
 * @param filter - text to search
 * @param filterType - optional type for advanced search
 * @param fields - fields to include or exclude
 * @returns
 */
export function filterPredicate(
    object: any,
    filter: string,
    filterType?: 'include' | 'exclude',
    fields?: string | string[]
): boolean {
    filter = filter.trim().toLowerCase();

    switch (filterType) {
        case 'include':
            object = pick(object, fields || '');
            break;
        case 'exclude':
            object = omit(object, fields || '');
            break;
    }

    for (const key in object) {
        if (typeof object[key] === 'object') {
            const result = filterPredicate(object[key], filter);
            if (result) return true;
        } else {
            if (object[key]?.toString().toLowerCase().includes(filter)) {
                return true;
            }
        }
    }

    return false;
}
