import React, {useEffect, useState,useMemo} from "react";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import Button,{ PageButton } from '../button/button'
import { SortIcon, SortUpIcon, SortDownIcon } from '../icons/Icons'
import { CSVLink } from "react-csv";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className="flex items-baseline gap-x-2">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  )
}

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id},
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
      const options = new Set()
preFilteredRows.forEach(row => {
    options.add(row.values[id])
  })
  return [...options.values()]
}, [id, preFilteredRows])

// Render a multi-select box
return (
  <select
    value={filterValue}
    onChange={e => {
      setFilter(e.target.value || '')
    }}
  >
    <option value="">All</option>
    {options.map((option, i) => (
      <option key={i} value={option}>
        {`${option}`}
      </option>
    ))}
  </select>
)
}

const InvestorDetails = ({investorInfo}) => {

    const [data, setData] = useState([]);

    useEffect(()=>{
      const newInvestorInfo = investorInfo.map((item, index) => {
        return {
          slno: index+1,
          ...item
        }
      });
        setData(newInvestorInfo)
    },[investorInfo])

    const columns = useMemo(() => [
        {
            Header: "Sl. No",
            accessor: 'slno'
        },
       
        {
            Header: "Address",
            accessor: 'round',
        },
        {
            Header: "Round",
            accessor: 'roundNumber',
            Filter: SelectColumnFilter,  
            filter: 'includes',
          },
        {
            Header: "Total Allocation",
            accessor: 'tokensAllotment',
        },
        {
            Header: "Withdrawn Tokens",
            accessor: 'withdrawnTokens',
        },
        {
            Header: "Remaning Tokens",
            accessor: 'remaningTokens',
        },
      ], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
    columns,
    data, 
  },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,  
  )

  const headers = [
    {label: "SL.no", key: "slno"},
    { label: "Address", key: "round"},
    { label: "Vesting months", key: "roundNumber"},
    { label: "Total allocation ", key: "tokensAllotment"},
    { label: "Withdrawn tokens", key: "withdrawnTokens"},
    { label: "Reamaning tokens", key: "remaningTokens"}
  ];

  console.log("state: ",state);
  return (
    <>
    <div className="flex justify-between">
      <div className="sm:flex sm:gap-x-2">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      <div className="flex px-4 py-2 font-medium text-gray-800 bg-transparent border border-gray-800 rounded hover:bg-white hover:border-transparent">
        <CSVLink data={data} headers={headers} filename={"investor-details.csv"}>
          <div className="flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"><path d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z"/></svg>
            </div>
            <div className="ml-2">
                Export data
            </div>
          </div>
        </CSVLink> 
      </div>
    </div>
      {/* table */}
      <div className="flex flex-col mt-4">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup}>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={column}
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase group"
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                  : <SortUpIcon className="w-4 h-4 text-gray-400" />
                                : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, idx) => {  
                    prepareRow(row)
                    return (
                      <tr key={row} {...row.getRowProps()} className={idx % 2 === 0 ? undefined : 'bg-gray-50'}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              key={cell}
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer"
                                ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                                : cell.render('Cell')
                              }
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between py-3">
        <div className="flex justify-between flex-1 sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-x-2">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                {/* <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-400" aria-hidden="true" /> */}
                <h1 className="text-gray-400">First</h1>
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="text-gray-400"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                Prev
              </PageButton>
              <PageButton
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="text-gray-400"
                >
                <span className="sr-only">Next</span>
                Next
                <ChevronRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                {/* <ChevronDoubleRightIcon className="w-5 h-5 text-gray-400" aria-hidden="true" /> */}
                <h1 className="text-gray-400">Last</h1>
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default InvestorDetails;
