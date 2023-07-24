import { Box, Button } from '@mui/material'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import api from '../../api'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * a hidden panel with extra features which shows up when  in adminMode
 * @param refreshFunc gets called when the button inside this panel "Delete All!" is clicked
 * @returns {JSX.Element} a box containing a button that triggers the given function when clicked or nothing when adminMode == false
 */
export default function AdminPanel({ refreshFunc }) {
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
