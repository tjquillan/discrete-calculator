import { Column, useTable } from "react-table"
import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core"
import TeX from "@matejmazur/react-katex"
import clsx from "clsx"
import "katex/dist/katex.min.css"

const useStyles = makeStyles((theme) =>
  createStyles({
    headerCell: {
      backgroundColor: theme.palette.grey[500]
    },
    tableCell: {
      borderWidth: 2,
      borderColor: theme.palette.grey[600],
      borderStyle: "solid"
    }
  })
)

export const LatexTable = ({ columns, data }: { columns: Array<Column>; data: Array<any> }) => {
  const classes = useStyles()
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  })

  return (
    <Table size="small" {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell
                align="center"
                className={clsx(classes.tableCell, classes.headerCell)}
                {...column.getHeaderProps()}
              >
                <TeX>{column.render("Header")}</TeX>
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
              {row.cells.map((cell) => {
                return (
                  <TableCell align="center" className={classes.tableCell} {...cell.getCellProps()}>
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
