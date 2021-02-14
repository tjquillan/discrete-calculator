import { Column, useTable } from "react-table"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

export const LatexTable = ({ columns, data }: { columns: Array<Column>; data: Array<any> }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                <TeX>{column.render('Header')}</TeX>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    <TeX>{cell.value}</TeX>
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
