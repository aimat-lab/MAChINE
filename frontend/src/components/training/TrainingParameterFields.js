import React from 'react'
import { Box, TextField } from '@mui/material'
import TrainingContext from '../../context/TrainingContext'
import PropTypes from 'prop-types'

/**
 * Parameter configuration fields on the TrainingPage
 * @param helpOpen function to open the help popper
 * @param helpClose  function to close the help popper
 * @param epochs configured number of epochs
 * @param setEpochs function called on epoch update
 * @param errorCallback communicates parameter error to parent
 * @returns {JSX.Element}
 */
export default function TrainingParameterFields({
  helpOpen,
  helpClose,
  epochs,
  setEpochs,
  errorCallback,
}) {
  const training = React.useContext(TrainingContext)
  const [epochsError, setEpochsError] = React.useState(false)
  const [batchSizeError, setBatchSizeError] = React.useState(false)
  const initialMount = React.useRef(true)

  React.useEffect(() => {
    errorCallback(epochsError || batchSizeError)
  }, [epochsError, batchSizeError])

  // check epochs on change
  React.useEffect(() => {
    if (epochs > 0) {
      setEpochsError(false)
    } else {
      setEpochsError(true)
    }
  }, [epochs])

  React.useEffect(() => {
    setEpochs(training.selectedEpochs)
  }, [training.selectedEpochs])

  // check batch size on change
  React.useEffect(() => {
    checkBatchSize(training.selectedBatchSize)
    // this is important, don't remove!
    if (initialMount.current) {
      initialMount.current = false
    } else {
      training.setTrainingFinished(false)
    }
    return () => {
      training.setTrainingFinished(false)
    }
  }, [training.selectedBatchSize])

  const checkBatchSize = (batchSize) => {
    if (batchSize > 0) {
      setBatchSizeError(false)
    } else {
      setBatchSizeError(true)
    }
  }

  const hoverFuncs = {
    epochs: (target) => {
      helpOpen(
        target,
        'This determines how long your model is trained. In each epoch, the entire dataset is passed through your net once.'
      )
    },
    batchSize: (target) => {
      helpOpen(
        target,
        "The batch size determines how often the net's parameters are adjusted. The smaller the batch size, the more often that's the case!"
      )
    },
  }

  return (
    <Box display="flex" flexDirection="row" className="training-parameters">
      <TextField
        sx={{ mx: 3, mt: 3, flexGrow: 1 }}
        required
        id="epochs"
        label="Epochs"
        type="number"
        value={epochs}
        disabled={training.trainingStatus}
        onChange={(event) => setEpochs(event.target.value)}
        error={epochsError}
        helperText={epochsError ? 'Must be a number > 0!' : ' '}
        onMouseOver={(e) => hoverFuncs.epochs(e.currentTarget)}
        onMouseLeave={helpClose}
      />
      <TextField
        sx={{ mx: 3, mt: 3, flexGrow: 1 }}
        required
        id="batchsize"
        label="Batch Size"
        type="number"
        value={training.selectedBatchSize}
        disabled={training.trainingStatus}
        onChange={(event) => training.setSelectedBatchSize(event.target.value)}
        error={batchSizeError}
        helperText={batchSizeError ? 'Must be a number > 0!' : ' '}
        onMouseOver={(e) => hoverFuncs.batchSize(e.currentTarget)}
        onMouseLeave={helpClose}
      />
    </Box>
  )
}

TrainingParameterFields.propTypes = {
  helpOpen: PropTypes.func,
  helpClose: PropTypes.func,
  epochs: PropTypes.number.isRequired,
  setEpochs: PropTypes.func.isRequired,
  errorCallback: PropTypes.func.isRequired,
}
