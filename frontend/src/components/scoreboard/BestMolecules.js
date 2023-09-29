import React from 'react'
import {
  Box,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import DataTable from './DataTable'
import { camelToNaturalString } from '../../utils'
import api from '../../api'
import PropTypes from 'prop-types'
import AdminPanel from './AdminPanel'
import UserContext from '../../context/UserContext'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'

/**
 * Displays a table of the best molecules for a selected label.
 * When in adminMode, deletion of selected or all molecules is possible.
 * @param labels
 * @returns {JSX.Element}
 * @constructor
 */
export default function BestMolecules({ labels }) {
  const [rows, setRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const [selectedLabel, setSelectedLabel] = React.useState(labels[0])
  const { adminMode } = React.useContext(UserContext)
  const { t, i18n } = useTranslation('scoreboardsPage')

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

  const deleteEntry = (id) => {
    const [fittingID, name] = id.split('|')
    api.deleteScoreboardMolecule(fittingID, name).then(() => {
      refresh()
    })
  }

  function deleteAllEntries() {
    api.deleteScoreboardMolecules().then(() => {
      refresh()
    })
  }

  function makeGridCompatible(data) {
    return data.map((row) => {
      row.id = `${row.fittingID}|${row.name}`
      row.analyzedValue = row[selectedLabel]
      delete row[selectedLabel]
      return row
    })
  }

  const columns = [
    {
      field: 'username', // the api request delivers an object, the field value is the key to be used
      headerName: t('common.userName'),
      headerAlign: 'center',
      align: 'center',
      flex: 30, // flex is for scaling, a flex 4 column will be twice as wide as a flex 2 column
      minWidth: 100,
    },
    {
      field: 'name',
      headerName: t('molecules.name'),
      headerAlign: 'center',
      align: 'center',
      flex: 40,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              display="flex"
              sx={{
                flexGrow: '1',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {params.value}
            </Box>
            {adminMode ? (
              <IconButton
                sx={{ alignItems: 'center' }}
                onClick={() => deleteEntry(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </Box>
        )
      },
    },
    {
      field: 'analyzedValue',
      headerName: camelToNaturalString(
        selectedLabel !== undefined ? selectedLabel : ''
      ),
      headerAlign: 'center',
      align: 'center',
      flex: 40,
      minWidth: 50,
    },
    {
      field: 'fittingID',
      headerName: t('molecules.usedModel'),
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
      {adminMode ? <AdminPanel deleteAllFunc={deleteAllEntries} /> : null}
      <FormControl sx={{ width: '30vw', minWidth: '100px' }}>
        <InputLabel id="label-selector-label" sx={{ m: 2 }}>
          {t('common.label')}
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
  labels: PropTypes.array,
}
