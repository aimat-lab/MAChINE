import { styled } from '@mui/material/styles'
import { pulseAnim } from '../../utils'
import React from 'react'
import {
  Box,
  Button,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

/**
 * @description Shadow for the StepIconContainer. Required because css drop-shadows don't work directly on clipPath divs
 * @type {StyledComponent<MUIStyledCommonProps<Theme>, JSX.IntrinsicElements[string], {}>}
 */
const StepIconContainerShadow = styled('div')(({ theme, state }) => ({
  zIndex: 2,
  ...(state.active && {
    filter: `drop-shadow(0px 0px 10px ${
      theme.stepper.active + (theme.palette.mode === 'dark' ? '80' : 'B0')
    })`,
  }),
}))

/**
 * @description Hex-shaped container for the step icon.
 * Color depends on the state of the step.
 * @type {StyledComponent<MUIStyledCommonProps<Theme>, JSX.IntrinsicElements[string], {}>}
 */
const StepIconContainer = styled('div')(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  width: 50,
  height: 57.735,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: -3.8675,
  position: 'relative',
  ...(ownerState.completed && {
    // completed step (not proper order)
    backgroundColor: theme.stepper.completed,
  }),
  ...(ownerState.isNext && {
    // recommended next step
    backgroundColor: theme.palette.primary.main,
    animation: `${pulseAnim} 1.5s ease-in-out infinite`,
  }),
  clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
}))

/**
 * @description Context for the stepper. Used to pass props from the step to the connector
 * Required because MUI does not allow passing props directly from step to StepConnector.
 * @type {React.Context<{isNext: boolean, fill: boolean, first: boolean}>}
 */
const StepContext = React.createContext({
  fill: false,
  first: false,
  isNext: false,
})

/**
 * @description styledComponent for the stepper connector line
 * @type {StyledComponent<PropsOf<(props: StepConnectorProps) => JSX.Element> & MUIStyledCommonProps<Theme>, {}, {}>}
 */
const StepperConnector = styled(StepConnector)(({ theme }) => {
  const { fill, first, isNext } = React.useContext(StepContext)
  return {
    top: 22,
    height: 6,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? '#121212' : '#bdbdbd',
    },
    ...(isNext && {
      backgroundImage: `linear-gradient( 95deg,${theme.stepper.completed} 0%,${theme.stepper.active} 100%,${theme.palette.primary.main})`,
    }),
    ...(fill && {
      backgroundColor: theme.stepper.completed,
    }),
    ...(first && {
      display: 'none',
    }),
  }
})

/**
 * @description The Icon for a step in the stepper.
 * Places the supplied icon in a hexagonal container with appropriate styling depending on the state of the step.
 * @param active If the step is currently selected in the stepper
 * @param completed If the step is completed
 * @param isNext If the step is the recommended next step
 * @param icon The icon to show for the step
 * @returns {JSX.Element}
 */
function StepperIcon({ active, completed, isNext, icon }) {
  const Icon = icon
  return (
    <StepIconContainerShadow state={{ active }}>
      <StepIconContainer ownerState={{ completed, isNext }}>
        <Icon />
      </StepIconContainer>
    </StepIconContainerShadow>
  )
}

StepperIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  isNext: PropTypes.bool,
  icon: PropTypes.any,
}

/**
 * @description A stepper for the home page. It is used to navigate to the different pages of the app.
 * Consists of a Stepper, a description and a button. The button navigates to the appropriate page for the selected step
 * @param steps An array of steps to show in the stepper
 * @param steps.label The label to show for the step
 * @param steps.icon The icon to show for the step
 * @param steps.completed Whether the step is completed or not
 * @param steps.description The description to show below the stepper
 * @param steps.buttonVerb The verb to use in the button, usually derived from the label
 * @param steps.location Where to navigate to when the button is clicked
 * @returns {JSX.Element}
 */
export default function HomePageStepper({ steps }) {
  const navigate = useNavigate()

  const handleStep = () => {
    navigate(steps[activeStep].location)
  }

  const nextIndex = steps.findIndex((step) => !step.completed)
  const [activeStep, setActiveStep] = React.useState(
    nextIndex > -1 ? nextIndex : 0
  )

  return (
    <Box>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<StepperConnector />}
      >
        {steps.map(({ label, icon, completed }, index) => (
          <StepContext.Provider
            value={{
              fill: index < nextIndex,
              first: index === 0,
              isNext: index === nextIndex,
            }}
            key={label}
          >
            <Step
              key={label}
              completed={completed}
              active={activeStep === index}
            >
              <StepLabel
                StepIconProps={{
                  isNext: index === nextIndex,
                  icon,
                }}
                StepIconComponent={StepperIcon}
                color="theme.palette.primary.main"
                onClick={() => setActiveStep(index)}
              >
                {label}
              </StepLabel>
            </Step>
          </StepContext.Provider>
        ))}
      </Stepper>
      <Box align="center" sx={{ mt: 4, mb: 2 }}>
        <Typography
          align="center"
          variant="h6"
          color="text.primary"
          paragraph
          component="div"
        >
          {steps[activeStep].description}
        </Typography>
        <Button
          variant="contained"
          onClick={handleStep}
          sx={{ mt: 1, mr: 1 }}
          color="primary"
        >
          Start {steps[activeStep].buttonVerb}!
        </Button>
      </Box>
    </Box>
  )
}

HomePageStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.any.isRequired,
      completed: PropTypes.bool,
      description: PropTypes.string.isRequired,
      buttonVerb: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
}
