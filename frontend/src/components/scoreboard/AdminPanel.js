import { Box, Button } from '@mui/material'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * a hidden panel with extra features which shows up when  in adminMode
 * @param refreshFunc gets called when the button inside this panel "Delete All!" is clicked
 * @returns {JSX.Element} a box containing a button that triggers the given function when clicked or nothing when adminMode == false
 */
export default function AdminPanel({ deleteAllFunc }) {
  return (
    <Box>
      <Button
        variant="contained"
        size="large"
        sx={{ m: 1 }}
        onClick={deleteAllFunc}
        endIcon={<DeleteSweepIcon />}
      >
        Delete All!
      </Button>
    </Box>
  )
}

AdminPanel.propTypes = {
  deleteAllFunc: PropTypes.func.isRequired,
}
