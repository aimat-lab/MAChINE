import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material'
import PropTypes from 'prop-types'
import { touchInputHandler } from '../../utils'

/**
 * Card depicting given dataset's details
 * @param dataset depicted dataset
 * @param clickFunc callback for click on the card
 * @param hoverFunc callback for hovering over card
 * @param leaveFunc callback for mouse pointer leaving the card
 * @returns {JSX.Element}
 */
export default function DatasetCard({
  dataset,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  const theme = useTheme()

  const longPress = touchInputHandler({ hoverFunc, clickFunc })

  return (
    <Card>
      <CardActionArea
        {...longPress()}
        onClick={(e) => {
          clickFunc(e.currentTarget)
        }}
        onMouseOver={(e) => {
          hoverFunc(e.currentTarget)
        }}
        onMouseLeave={leaveFunc}
      >
        <Box position="relative">
          <Box
            sx={{
              height: '155px',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: `url("/datasets/data${
                dataset.datasetID % 7
              }.png")`,
              filter: 'grayscale(100%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: theme.palette.primary.overlay,
              opacity: 1,
              mixBlendMode: 'hard-light',
            }}
          />
        </Box>
        <CardContent>
          <Typography gutterBottom component="div">
            {dataset.name} #{dataset.datasetID}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Size: {dataset.size}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

DatasetCard.propTypes = {
  dataset: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
