import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import { LongPressEventType, useLongPress } from 'use-long-press'
import PropTypes from 'prop-types'

/**
 * A base model card is utilized in the process of the user creating a model.
 * It displays one base model's name, image, and basic information.
 * @param baseModel The data from a base model
 * @param clickFunc callback for onClick
 * @param hoverFunc callback for onMouseOver
 * @param leaveFunc callback for onMouseLeave
 * @returns {JSX.Element} The the element for the website.
 * @constructor
 */
export default function BaseModelCard({
  baseModel,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const theme = useTheme()

  /** The longPress function is used to detect a long press on a base model card.
   *  It is used to trigger the hoverFunc for touch input devices.
   *  The click function of the card has been moved here, so it only triggers when the long press is aborted.
   **/
  const longPress = useLongPress(
    () => {
      hoverFunc(helpAnchorEl)
      setHelpAnchorEl(null)
    },
    {
      onCancel: () => clickFunc(baseModel),
      onStart: (e) => {
        setHelpAnchorEl(e.currentTarget)
      },
      filterEvents: () => true, // All events can potentially trigger long press
      threshold: 350,
      captureEvent: true,
      cancelOnMovement: false,
      detect: LongPressEventType.Touch,
    }
  )

  return (
    <Grid item xs={4} md={3}>
      {/* ^ The grid has a total width of  12. The xs defines how much of that width each component of the grid gets,
      and as such also how many elements each row of the grid can fit. If xs=3, then four elements can fit in one
       row of width 3*4=12 */}
      <Card>
        <CardActionArea
          className={`base-model-card id-${baseModel.id}`}
          {...longPress()}
        >
          <Box position="relative">
            <Box
              sx={{
                height: '155px',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url("/models/network${
                  baseModel.id % 5
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
            <Box paddingX={1}>
              {/* Displays the base model's name */}
              <Typography variant="h4" component="h3">
                {baseModel.name}
              </Typography>
              {/* Displays the base model's type */}
              <Typography variant="subtitle1" component="h4">
                Type: {baseModel.type.name}
              </Typography>
              {/* Displays the base model's taskType (classifier or regression) */}
              <Typography variant="subtitle1" component="h4">
                Model task: {baseModel.taskType}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

BaseModelCard.propTypes = {
  baseModel: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
