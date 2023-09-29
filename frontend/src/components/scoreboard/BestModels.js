import {
  Box,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { camelToNaturalString } from '../../utils'
import React from 'react'
import api from '../../api'
import TrainingContext from '../../context/TrainingContext'
import DeleteIcon from '@mui/icons-material/Delete'
import UserContext from '../../context/UserContext'
import DataTable from './DataTable'
import PropTypes from 'prop-types'
import AdminPanel from './AdminPanel'
import { useTranslation } from 'react-i18next'

export default function BestModels({ datasets }) {
  const [selectedDataset, setSelectedDataset] = React.useState({
    name: '',
    labelDescriptors: [],
  })
  const [selectedDatasetName, setSelectedDatasetName] = React.useState('')
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const [rows, setRows] = React.useState([])
  const training = React.useContext(TrainingContext)
  const { adminMode } = React.useContext(UserContext)
  const { t, i18n } = useTranslation('scoreboardsPage')

  React.useEffect(() => {
    if (datasets.length > 0) {
      setSelectedDataset(datasets[0])
      setSelectedDatasetName(datasets[0].name)
      setSelectedLabel(datasets[0].labelDescriptors[0])
    }
  }, [datasets])

  React.useEffect(() => {
    if (selectedDataset && selectedLabel) {
      refresh()
    }
  }, [training.trainingStatus, selectedDatasetName, selectedLabel])

  /**
   * obtains table data from backend:
   * - fittings to be displayed in the Scoreboard and
   * - fittings of the current user
   */
  function refresh() {
    api
      .getModelScoreboard(selectedDataset.datasetID, [selectedLabel])
      .then((data) => {
        setRows(data)
      })
    api.getFittings().then((data) => {
      setHighlightedRows(data)
    })
  }

  const deleteEntry = (id) => {
    api.deleteScoreboardFitting(id).then(() => {
      refresh()
    })
  }

  // defining the order and context of the columns
  const fittingColumns = [
    {
      field: 'userName', // the api request delivers an object, the field value is the key to be used
      headerName: t('common.userName'), // the header name is the name displayed in the table header
      headerAlign: 'center',
      align: 'center',
      flex: 35, // flex is for scaling, a flex 4 column will be twice as wide as a flex 2 column
      minWidth: 100,
    },

    {
      field: 'modelName',
      headerName: t('models.modelName'),
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      flex: 35,
      minWidth: 140,
    },
    {
      field: 'epochs',
      headerName: t('models.epochs'),
      headerAlign: 'center',
      align: 'center',
      flex: 17,
      minWidth: 100,
    },
    {
      field: 'learningRate',
      headerName: t('models.learningRate'),
      headerAlign: 'center',
      align: 'center',
      flex: 27,
      minWidth: 100,
    },
    {
      field: 'batchSize',
      headerName: t('models.batchSize'),
      headerAlign: 'center',
      align: 'center',
      flex: 27,
      minWidth: 100,
    },
    {
      field: 'accuracy',
      headerName: t('models.accuracy'),
      headerAlign: 'center',
      align: 'center',
      flex: 27,
      minWidth: 100,
    },
    {
      field: 'id',
      headerName: t('models.id'),
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      // a renderCell allows to put html inside a Table cell, like for example a button
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
              <div>{params.id}</div>
            </Box>
            <Box display="flex">
              {adminMode ? (
                <IconButton
                  sx={{ alignItems: 'center' }}
                  onClick={() => deleteEntry(params.id)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Box>
          </Box>
        )
      },
      flex: 42,
      minWidth: 160,
    },
  ]

  const handleDatasetSelection = (newValue) => {
    const ds = datasets.find((dataset) => dataset.name === newValue)
    setSelectedDataset(ds)
    setSelectedLabel(ds.labelDescriptors[0])
    setSelectedDatasetName(newValue)
  }

  const handleLabelSelection = (newValue) => {
    setSelectedLabel(newValue)
  }

  function deleteEntries() {
    api.deleteScoreboardFittings().then(() => {
      refresh()
    })
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
      {adminMode ? <AdminPanel deleteAllFunc={deleteEntries} /> : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          minWidth: '50vw',
          width: '60vw',
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="dataset-selector-label" sx={{ m: 2 }}>
            {t('models.dataset')}
          </InputLabel>
          <Select
            value={selectedDatasetName}
            label="dataset-selector"
            onChange={(e) => {
              handleDatasetSelection(e.target.value)
            }}
            sx={{ m: 2 }}
          >
            {datasets.map((dataset, index) => {
              return (
                <MenuItem key={index} value={dataset.name}>
                  {dataset.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
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
            {'labelDescriptors' in selectedDataset
              ? selectedDataset.labelDescriptors.map((label) => {
                  return (
                    <MenuItem key={label} value={label}>
                      {camelToNaturalString(label)}
                    </MenuItem>
                  )
                })
              : null}
          </Select>
        </FormControl>
      </Box>
      <Card sx={{ maxWidth: '90vw', m: 4 }}>
        <DataTable
          columns={fittingColumns}
          rows={rows}
          highlightedRows={highlightedRows}
        />
      </Card>
    </Box>
  )
}

BestModels.propTypes = {
  datasets: PropTypes.array,
}
