/**
 * creates a styled table
 * @param columns array of object that describes the columns
 * @param rows array of objects that represent a row each, where the keys match the 'field' values stated in columns
 * @param highlightedRows array of objects just like 'rows', the cut of 'rows' and 'highlightedRows' gets highlighted
 * @returns {JSX.Element} resizable table
 * @constructor
 */
import { DataGrid } from '@mui/x-data-grid'
import { Stack } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

export default function DataTable({ columns, rows, highlightedRows }) {
  return (
    <DataGrid
      sx={{ height: '60vh', width: '90vw' }}
      rows={rows}
      columns={columns}
      disableColumnMenu={true}
      hideFooter={true}
      useResizeContainer={true}
      // pageSize={10} // Uncomment to limit visible entries
      // check for each fitting if it's been created by the current user
      getRowClassName={(params) => {
        return highlightedRows.some(({ id }) => id === params.row.id)
          ? 'table-theme'
          : null
      }}
      initialState={{
        columns: {
          columnVisibilityModel: {
            datasetID: false,
          },
        },
      }}
      // what is shown when there are no fittings
      slots={{
        noRowsOverlay: () => (
          <Stack
            height="100%"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            Be the first!
          </Stack>
        ),
      }}
    />
  )
}

DataTable.propTypes = {
  columns: PropTypes.any,
  rows: PropTypes.any,
  highlightedRows: PropTypes.array,
}
