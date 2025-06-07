import React from "react"
import { flexRender, RowData, Table as TanStackTable } from "@tanstack/react-table"

interface ITableComponentProps<TData extends RowData> {
    table: TanStackTable<TData>
    controls?: boolean
}

const Table = <TData extends RowData>({ table, controls = true }: ITableComponentProps<TData>) => {
    return (
        <>
            <div className="table-wrapper rounded-box border border-base-content/5 bg-base-100 overflow-x-scroll">
                <table className="table">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-gray-200 border-b-1">
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {controls && (
                <div className="table-controls flex items-center justify-between gap-2 mt-5 w-full px-3">
                    <div className="arrows left flex items-center gap-3">
                        <button
                            className="border rounded p-1 px-3 cursor-pointer"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<<"}
                        </button>
                        <button
                            className="border rounded p-1 px-3 cursor-pointer"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<"}
                        </button>
                    </div>
                    <div className="go-to-page flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <div>Page</div>
                          <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                              {table.getPageCount()}
                          </strong>
                        </span>
                        <span className="flex items-center gap-2">
                              | Go to page:
                              <input
                                  type="number"
                                  min="1"
                                  max={table.getPageCount()}
                                  defaultValue={table.getState().pagination.pageIndex + 1}
                                  onChange={e => {
                                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                                      table.setPageIndex(page)
                                  }}
                                  className="border p-1 rounded w-16"
                              />
                        </span>
                    </div>
                    <select className="select cursor-pointer"
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    <div className="arrows-right flex items-center gap-3">
                        <button
                            className="border rounded p-1 px-3 cursor-pointer"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {">"}
                        </button>
                        <button
                            className="border rounded p-1 px-3 cursor-pointer"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {">>"}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Table