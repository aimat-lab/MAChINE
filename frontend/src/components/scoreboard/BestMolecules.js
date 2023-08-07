import React from 'react'
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import DataTable from './DataTable'
import { camelToNaturalString } from '../../utils'
import api from '../../api'
import PropTypes from 'prop-types'

export default function BestMolecules({ passRefreshFunc, labels }) {
  const [rows, setRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const [selectedLabel, setSelectedLabel] = React.useState(labels[0])

  function makeGridCompatible(data) {
    return data.map((row) => {
      row.id = `${row.fittingID}|${row.name}`
      row.analyzedValue = row[selectedLabel]
      delete row[selectedLabel]
      return row
    })
  }

  /**
   * obtains table data from backend:
   * - molecules and analyses to be displayed in the Scoreboard and
   * - molecules and analyses of the current user
   */
  function refresh() {
    api.getMoleculeScoreboard(selectedLabel).then((data) => {
      setRows(makeGridCompatible(data))
    })
    api.getMoleculeList().then((data) => {
      setHighlightedRows(data)
    })
  }

  React.useEffect(() => {
    if (selectedLabel !== '') {
      refresh()
    }
  }, [selectedLabel])

  React.useEffect(() => {
    passRefreshFunc(refresh)
  }, [])

  const columns = [
    {
      field: 'username', // the api request delivers an object, the field value is the key to be used
      headerName: 'Username',
      headerAlign: 'center',
      align: 'center',
      flex: 30, // flex is for scaling, a flex 4 column will be twice as wide as a flex 2 column
      minWidth: 100,
    },
    {
      field: 'name',
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
      flex: 40,
      minWidth: 50,
    },
    {
      field: 'fittingID',
      headerName: 'Used Model',
      headerAlign: 'center',
      align: 'center',
      flex: 30,
      minWidth: 100,
    },
  ]

  function handleLabelSelection(value) {
    setSelectedLabel(value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <FormControl sx={{ width: '30vw', minWidth: '100px' }}>
        <InputLabel id="label-selector-label" sx={{ m: 2 }}>
          Label
        </InputLabel>
        <Select
          value={selectedLabel}
          label="label-selector"
          onChange={(e) => {
            handleLabelSelection(e.target.value)
          }}
          sx={{ m: 2 }}
        >
          {labels.map((label) => {
            return (
              <MenuItem key={label} value={label}>
                {camelToNaturalString(label)}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
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

BestMolecules.propTypes = {
  passRefreshFunc: PropTypes.func,
  labels: PropTypes.array,
}
