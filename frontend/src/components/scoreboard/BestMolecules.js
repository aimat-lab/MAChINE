import React from 'react'
import { Box, Card } from '@mui/material'
import DataTable from './DataTable'
import { camelToNaturalString } from '../../utils'
import api from '../../api'

export default function BestMolecules() {
  /*
   *  TODO: add api call to get scoreboard analyses (front and back)
   *  TODO: add molecule scoreboard in backend
   *  TODO: rename getMoleculeList to getMolecules
   *  TODO: add label selection
   *  TODO: get datasets and labels in ScoreboardPage and pass them to children
   *  TODO: multiple analyses per molecule for same label? kick lower? keep all?
   */
  const [rows, setRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const [selectedLabel, setSelectedLabel] = React.useState('')

  /**
   * obtains table data from backend:
   * - molecules and analyses to be displayed in the Scoreboard and
   * - molecules and analyses of the current user
   */
  function refresh() {
    /* api.getScoreboardAnalyses(selectedLabel).then((data) => {
      setRows(data)
    }) */
    api.getMoleculeList().then((data) => {
      setHighlightedRows(data)
    })
  }

  const columns = [
    {
      field: 'userName', // the api request delivers an object, the field value is the key to be used
      headerName: 'Username',
      headerAlign: 'center',
      align: 'center',
      flex: 40, // flex is for scaling, a flex 4 column will be twice as wide as a flex 2 column
      minWidth: 100,
    },
    {
      filed: 'moleculeName',
      headerName: 'Molecule',
      headerAlign: 'center',
      align: 'center',
      flex: 40,
      minWidth: 100,
    },
    {
      field: 'analyzedValue',
      headerName: camelToNaturalString(selectedLabel),
      headerAlign: 'center',
      align: 'center',
      flex: 20,
      minWidth: 50,
    },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: '90vw', m: 4 }}>
        <DataTable
          columns={columns}
          rows={rows}
          highlightedRows={highlightedRows}
        />
      </Card>
    </Box>
  )
}
