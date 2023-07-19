import React from 'react'
import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid } from '@mui/x-data-grid'
import api from '../api'
import UserContext from '../context/UserContext'
import TrainingContext from '../context/TrainingContext'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../utils'

/**
 * The Scoreboard gets its data via a Api request and the userContext, thus no paramets need to be specified
 * @returns {JSX.Element} box containing a headline, adminpanel and a Scoreboard
 * @constructor
 */
export default function ScoreboardsPage() {
  const [selectedDataset, setSelectedDataset] = React.useState({
    name: '',
    labelDescriptors: [],
  })
  const [selectedDatasetName, setSelectedDatasetName] = React.useState('')
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const [datasets, setDatasets] = React.useState([])
  const [fittingRows, setFittingRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const { adminMode } = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)

  React.useEffect(() => {
    api.getDatasets().then((datasetList) => {
      setDatasets(datasetList)
    })
  }, [])

  React.useEffect(() => {
    if (selectedDataset && selectedLabel) {
      refresh()
    }
  }, [training.trainingStatus, selectedDatasetName, selectedLabel])

  const handleDatasetSelection = (newValue) => {
    const ds = datasets.find((dataset) => dataset.name === newValue)
    setSelectedDataset(ds)
    setSelectedLabel(ds.labelDescriptors[0])
    setSelectedDatasetName(newValue)
  }

  const handleLabelSelection = (newValue) => {
    setSelectedLabel(newValue)
  }

  /**
   * gets the required info from the backend: all the fittings to be displayed in the Scoreboard and
   * all fitting of the current use to be able to highlight them
   */
  function refresh() {
    api
      .getScoreboardSummaries(selectedDataset.datasetID, [selectedLabel])
      .then((data) => {
        setFittingRows(data)
      })
    api.getFittings().then((data) => {
      setHighlightedRows(data)
    })
  }

  // defining the order and context of the columns
  const fittingColumns = [
    {
      field: 'userName', // the api request delivers an object, the field value is the key to be used
      headerName: 'Username',
      headerAlign: 'center',
      align: 'center',
      flex: 40, // flex is for scaling, a flex 4 column will be twice as wide as a flex 2 column
      minWidth: 100,
    },

    {
      field: 'modelName',
      headerName: 'Modelname',
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      flex: 40,
      minWidth: 140,
    },
    {
      field: 'id',
      headerName: 'Trained Model ID',
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
                  onClick={() => {
                    api.deleteScoreboardFitting(params.id).then(() => {
                      refresh()
                    })
                  }}
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
    {
      field: 'datasetName',
      headerName: 'Dataset Name',
      headerAlign: 'center',
      align: 'center',
      flex: 40,
      minWidth: 225,
      renderCell: (params) => {
        return <div>{`${params.row.datasetName} #${params.row.datasetID}`}</div>
      },
    },
    {
      field: 'datasetID',
      headerName: 'Dataset ID',
    },
    {
      field: 'labels',
      headerName: 'Label',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 10,
      minWidth: 90,
      // capitalize the first letter of each label
      renderCell: (params) => {
        return <div>{camelToNaturalString(params.value.join(', '))}</div>
      },
    },
    {
      field: 'epochs',
      headerName: 'Epochs',
      headerAlign: 'center',
      align: 'center',
      flex: 9,
      minWidth: 90,
    },
    {
      field: 'batchSize',
      headerName: 'Batch Size',
      headerAlign: 'center',
      align: 'center',
      flex: 23,
      minWidth: 100,
    },
    {
      field: 'accuracy',
      headerName: 'Accuracy (R²)',
      headerAlign: 'center',
      align: 'center',
      flex: 28,
      minWidth: 100,
    },
  ]

  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        mx: 4,
        mb: 4,
        mt: 1,
        '& .table-theme': {
          fontWeight: 'bold',
        },
      }}
    >
      <Typography sx={{ m: 4 }} variant="h4">
        Best Models
      </Typography>
      {adminMode ? <AdminPanel refreshFunc={refresh} /> : null}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          minWidth: '50vw',
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="dataset-selector-label" sx={{ m: 2 }}>
            Dataset
          </InputLabel>
          <Select
            value={selectedDatasetName}
            label="dataset-selector"
            onChange={(e) => {
              handleDatasetSelection(e.target.value)
            }}
            sx={{ m: 2 }}
          >
            {datasets.map((dataset) => {
              return (
                <MenuItem key={dataset.id} value={dataset.name}>
                  {dataset.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
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
          rows={fittingRows}
          highlightedRows={highlightedRows}
        />
      </Card>
    </Box>
  )
}

/**
 * a hidden panel with extra features which shows up when  in adminMode
 * @param refreshFunc gets called when the button inside this panel "Delete All!" is clicked
 * @returns {JSX.Element} a box containing a button that triggers the given function when clicked or nothing when adminMode == false
 */
function AdminPanel({ refreshFunc }) {
  return (
    <Box>
      <Button
        variant="contained"
        size="large"
        sx={{ m: 1 }}
        onClick={() => {
          api.deleteScoreboardFittings().then(() => {
            refreshFunc()
          })
        }}
        endIcon={<DeleteSweepIcon />}
      >
        Delete All!
      </Button>
    </Box>
  )
}

AdminPanel.propTypes = {
  changeFunc: PropTypes.func,
  refreshFunc: PropTypes.func,
}

/**
 * creates a styled table
 * @param columns array of object that describes the columns
 * @param rows array of objects that represent a row each, where the keys match the 'field' values stated in columns
 * @param highlightedRows array of objects just like 'rows', the cut of 'rows' and 'highlightedRows' gets highlighted
 * @returns {JSX.Element} resizable table
 * @constructor
 */

function DataTable({ columns, rows, highlightedRows }) {
  return (
    <DataGrid
      sx={{ height: '72vh', width: '90vw' }}
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
            No trained models yet.
            <br />
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
