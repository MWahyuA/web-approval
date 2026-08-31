import React, { forwardRef } from 'react';
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="w-full overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
            <table
                ref={ref}
                className={`w-full caption-bottom text-sm ${className || ''}`}
                {...props}
            />
        </div>
    )
);
Table.displayName = 'Table';

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={`[&_tr]:border-b bg-slate-50 border-slate-200 ${className || ''}`} {...props} />
    )
);
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody
            ref={ref}
            className={`[&_tr:last-child]:border-0 bg-white divide-y divide-slate-100 ${className || ''}`}
            {...props}
        />
    )
);
TableBody.displayName = 'TableBody';

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={`border-slate-100 transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-50 ${className || ''}`}
            {...props}
        />
    )
);
TableRow.displayName = 'TableRow';

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={`h-12 px-5 py-3 text-left align-middle text-[11px] font-semibold text-slate-500 uppercase tracking-wider [&:has([role=checkbox])]:pr-0 ${className || ''}`}
            {...props}
        />
    )
);
TableHead.displayName = 'TableHead';

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={`px-5 py-4 align-middle text-sm text-slate-600 [&:has([role=checkbox])]:pr-0 ${className || ''}`}
            {...props}
        />
    )
);
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
