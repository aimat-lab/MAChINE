import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../../utils'

/**
 * Card displaying information for given fitting
 * @param fitting displayed fitting
 * @param clickFunc callback to handle a click on the card
 * @param hoverFunc callback for hovering
 * @param leaveFunc callback for mouse pointer leaving the card
 * @returns {JSX.Element}
 */
export default function FittingCard({
  fitting,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  const theme = useTheme()
  return (
    <Grid item xs={4} md={3}>
      <Card>
        <CardActionArea
          onClick={(e) => {
            clickFunc(e)
          }}
          onMouseOver={(e) => hoverFunc(e)}
          onMouseLeave={() => leaveFunc()}
        >
          <CardContent>
            <CardHeader
              sx={{ p: 1, pl: 2 }}
              title={
                <span style={{ color: theme.palette.primary.main }}>
                  {fitting.modelName}
                </span>
              }
              subheader={`ID: ${fitting.id}`}
            />
            <Box paddingX={2}>
              <Typography
                variant="subtitle1"
                component="h4"
                sx={{ fontWeight: 'bold' }}
              >
                {fitting.labels.length > 1 ? `Labels:` : `Label:`}{' '}
                {fitting.labels.map(
                  (label, index) =>
                    camelToNaturalString(label) +
                    (index < fitting.labels.length - 1 ? ', ' : '')
                )}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Dataset: {fitting.datasetName} #{fitting.datasetID}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Epochs: {fitting.epochs}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Batch Size: {fitting.batchSize}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Accuracy (R²): {fitting.accuracy}%
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

FittingCard.propTypes = {
  fitting: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
