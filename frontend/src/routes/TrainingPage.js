import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import api from '../api'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import PrettyChart from '../components/training/PrettyChart'
import SnackBarAlert from '../components/misc/SnackBarAlert'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import TrainingContext from '../context/TrainingContext'
import { useNavigate } from 'react-router-dom'
import TrainingParameterFields from '../components/training/TrainingParameterFields'
import { pulseAnim } from '../utils'

/**
 * Holds epoch and batch size configuration, as well as selected model and dataset details
 * @returns {JSX.Element} jsx including information about the configuration of the training, live updated chart and start/stop/continue buttons
 */
export default function TrainingPage() {
  const training = React.useContext(TrainingContext)
  const help = React.useContext(HelpContext)
  const [showDialog, setShowDialog] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const [localEpochs, setLocalEpochs] = React.useState(training.selectedEpochs)
  const [parameterError, setParameterError] = React.useState(false)
  const [startStopButton, setStartStopButton] = React.useState('Start')
  const [loadTraining, setLoadTraining] = React.useState(false)
  const [openSnackError, setOpenSnackError] = React.useState(false)
  const [showFinishDialog, setShowFinishDialog] = React.useState(false)
  const [showTrainingErrorDialog, setShowTrainingErrorDialog] =
    React.useState(false)
  const theme = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (training.trainingStatus) {
      setLoadTraining(false)
      setStartStopButton('Stop')
    } else {
      setShowDialog(false)
      setStartStopButton('Start')
    }
  }, [training.trainingStatus])

  React.useEffect(() => {
    if (training.trainingFailed) {
      setShowTrainingErrorDialog(true)
    }
  }, [training.trainingFailed])

  const handleStartStop = () => {
    if (training.trainingStatus) {
      setShowDialog(true)
    } else {
      training.softResetContext()
      setLoadTraining(true)
      training.setSelectedEpochs(localEpochs)
      api
        .trainModel(
          // model configuration gets assembled here
          training.selectedDataset.datasetID,
          training.selectedModel.id,
          training.selectedLabels,
          localEpochs,
          training.selectedLearningRate,
          training.selectedBatchSize
        )
        .then((response) => {
          setOpenSnackError(!response)
          setLoadTraining(response)
          help.setMadeFitting(true)
        })
    }
  }

  const handleAdditionalTraining = () => {
    setLoadTraining(true)
    api.continueTraining(training.trainingID, localEpochs).then((response) => {
      setOpenSnackError(!response)
      setLoadTraining(Boolean(response))
    })
  }

  React.useEffect(() => {
    setShowFinishDialog(training.trainingFinished)
  }, [training.trainingFinished])

  const abortTraining = () => {
    training.stopTraining()
    handleCloseDialog()
  }

  // filter epoch progress, makes no sense as a graph
  function filterData(data) {
    // Change this to exclude more data
    const excludedPoints = ['Epoch']
    const newData = []
    Object.entries(data).forEach(([dataName, values]) => {
      if (excludedPoints.indexOf(dataName) === -1) {
        if (values.length === 1) {
          values = [...values, ...values]
        }
        newData.push({ name: dataName, data: values })
      }
    })
    return newData
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const handleCloseFinishDialog = () => {
    setShowFinishDialog(false)
  }

  const handleHelpPopperOpen = (target, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(target)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  function handleCloseTrainingErrorDialog() {
    setShowTrainingErrorDialog(false)
  }

  return (
    <Grid container>
      <Grid item xs={6} className="training-overview-parameters">
        <TrainingParameterFields
          helpOpen={handleHelpPopperOpen}
          helpClose={handleHelpPopperClose}
          epochs={localEpochs}
          setEpochs={setLocalEpochs}
          errorCallback={setParameterError}
        />

        <ModelDetailsCard
          selectedModel={training.selectedModel}
          hoverFunc={(target) => {
            handleHelpPopperOpen(
              target,
              'Here you can see basic informations about your model. Among them are your chosen values for the optimizer, the loss, and other model-specific data.'
            )
          }}
          leaveFunc={handleHelpPopperClose}
        />
        <DatasetDetailsCard
          selectedDataset={training.selectedDataset}
          selectedLabels={training.selectedLabels}
          hoverFunc={(target) => {
            handleHelpPopperOpen(
              target,
              'Here you can see basic information about your chosen dataset. Most importantly, its size, and which label you chose to train on!'
            )
          }}
          leaveFunc={handleHelpPopperClose}
        />
      </Grid>
      <Grid item xs={6}>
        <Box
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e.currentTarget,
              'This chart shows the progression of your model in training. On the x-axis, you can see for how many epochs your model has been trained. Take a look at the different functions: They tell you how good your model is in predicting data from the dataset. For loss: The lower, the better! For r-squared: The closer to 1, the better (and a negative value is very bad).'
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <PrettyChart
            data={filterData(training.trainingData)}
            maxLength={training.selectedEpochs}
          />
        </Box>
        <Grid container>
          <Grid item xs={8}>
            <Button
              size="large"
              variant="contained"
              disabled={parameterError}
              sx={{
                m: 2,
                animation:
                  help.helpMode && !help.madeFitting
                    ? `${pulseAnim} 2s infinite`
                    : 'none',
              }}
              onClick={handleStartStop}
            >
              {startStopButton}
              {!loadTraining ? null : (
                <CircularProgress size="16px" color="inherit" sx={{ ml: 1 }} />
              )}
            </Button>
            <Dialog open={showDialog} onClose={handleCloseDialog}>
              <DialogTitle>{'Abort current training?'}</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={abortTraining}>Abort</Button>
              </DialogActions>
            </Dialog>
            {!training.trainingFinished ? null : (
              <Button
                size="large"
                variant="outlined"
                disabled={parameterError || loadTraining}
                sx={{ m: 2 }}
                onClick={handleAdditionalTraining}
              >
                Train additional {localEpochs} epochs
              </Button>
            )}
          </Grid>
          <Grid item xs={4}>
            <Button
              size="large"
              variant="outlined"
              sx={{ m: 2 }}
              onClick={() => navigate('/molecules')}
            >
              Continue to Molecules
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={showTrainingErrorDialog}
        onClose={handleCloseTrainingErrorDialog}
      >
        <DialogTitle>{'Error during training!'}</DialogTitle>
        <Typography
          display="flex"
          sx={{
            justifyContent: 'center',
            color: theme.palette.text.secondary,
            p: 2,
          }}
        >
          {"Don't worry, your previous training data hasn't been lost."}
        </Typography>
        <DialogActions>
          <Button onClick={handleCloseTrainingErrorDialog}>Close</Button>
          <Button
            onClick={() => {
              navigate('/models')
            }}
          >
            Continue to models
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showFinishDialog} onClose={handleCloseFinishDialog}>
        <DialogTitle>{'Your training finished!'}</DialogTitle>
        <Typography
          display="flex"
          sx={{
            justifyContent: 'center',
            color: theme.palette.text.secondary,
            p: 2,
          }}
        >
          {"Your model's accuracy (R²): " + training.finishedAccuracy + '%'}
        </Typography>
        <DialogActions>
          <Button onClick={handleCloseFinishDialog}>Close</Button>
          <Button
            onClick={() => {
              navigate('/molecules')
            }}
          >
            Continue to molecules
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBarAlert
        open={openSnackError}
        onClose={() => setOpenSnackError(false)}
        severity="error"
        message="There was an issue with your training. Please try again."
      />
      <HelpPopper
        id="helpPopper"
        helpPopperContent={helpPopperContent}
        open={Boolean(helpAnchorEl)}
        anchorEl={helpAnchorEl}
        onClose={handleHelpPopperClose}
      />
    </Grid>
  )
}
