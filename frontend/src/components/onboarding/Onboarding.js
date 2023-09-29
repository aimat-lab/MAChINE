import React from 'react'
import { useTheme } from '@mui/material'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import Joyride, { ACTIONS, EVENTS } from 'react-joyride'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import OnboardingTooltip from './OnboardingTooltip'

export default function Onboarding({ run, callback }) {
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = React.useState(0)
  const training = React.useContext(TrainingContext)

  // Callback runs for every Joyride event
  const internalCallback = (data) => {
    const { action, index, type } = data
    // Reset the step index, so the tour starts from the beginning every time
    if (
      [ACTIONS.START, ACTIONS.RESTART, ACTIONS.CLOSE, ACTIONS.SKIP].includes(
        action
      )
    ) {
      setStepIndex(0)
      // Select example training parameters, so the training page can be shown during tour
      training.selectExampleTrainingParameters()
    }

    // Advance (or go back) to the next step
    // Also do this if the target is not found, so the tour can continue
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1)
      setStepIndex(nextIndex)
      // If the step requires a certain location, navigate to it
      // Using nextIndex because setStepIndex is async
      if (EVENTS.STEP_AFTER === type) {
        if (steps[nextIndex]?.location) {
          navigate(
            steps[nextIndex].location,
            steps[nextIndex].params ? steps[nextIndex].params : {}
          )
        }
      }
    }

    if (ACTIONS.CLOSE === action || ACTIONS.SKIP === action) {
      if (steps[index].closeLocation) {
        navigate(steps[index].closeLocation)
      }
    }

    // Call external callback
    callback(data)
  }

  // The steps of the tour
  // steps with closeLocations will navigate to the specified location when the tour is closed
  // steps with location will navigate to the specified location
  // params can be passed to the location, closeLocations do not support params
  const steps = [
    {
      // Introduction step
      content: (
        <div>
          <h2>
            Hi {user.userName}! Welcome to{' '}
            <span style={{ color: theme.palette.primary.main }}>MAChINE</span>!
          </h2>
          This tour will guide you through the process of creating and training
          your own machine learning models.
          <br />
          You&apos;ll get to use them to analyze molecules you will have drawn.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/home',
    },
    {
      // Help mode button step
      location: '/home',
      target: '.help-mode-button',
      content: (
        <div>
          <h2>
            First of all:{' '}
            <span style={{ color: theme.palette.primary.main }}>Help mode</span>
            !
          </h2>
          Help mode shows you hints on parameters and panels when you hover over
          them.
          <br />
          It has been turned on for now, but you can always toggle it by using
          this button.
        </div>
      ),
    },
    {
      // Stepper step
      location: '/home',
      target: '.MuiStepper-root',
      offset: -2,
      placement: 'left',
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>
              progress overview stepper
            </span>
          </h2>
          The stepper shows you what you&apos;ve already achieved with our app!
          <br />
          It also gives you handy suggestions on what to do next.
          <br />
          Let&apos;s go through all the steps together!
        </div>
      ),
    },
    {
      // Models page step
      location: '/models',
      content: (
        <div>
          <h2>Configure</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>models page</span>
          !<br />
          Here you can see all the models you have created so far. <br />
          To create a model, simply click on &quot;Add a model&quot;.
        </div>
      ),
      target: '.selection-list',
      placement: 'right',
    },
    {
      // Model page training step
      location: '/models',
      content: (
        <div>
          <h2>Training</h2>
          Once you&apos;ve configured your model, click on &quot;Train
          Model&quot; <br />
          to select a dataset and configure the model&apos;s training process.
        </div>
      ),
      target: 'body',
      placement: 'center',
    },
    {
      // Training parameters step
      location: '/training',
      closeLocation: '/models',
      target: '.training-parameters',
      content: (
        <div>
          <h2>Training</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            training page
          </span>
          !<br />
          Here you can configure some final training parameters and...
        </div>
      ),
      placement: 'bottom',
    },
    {
      // Training graph step
      location: '/training',
      closeLocation: '/models',
      content: (
        <div>
          <h2>Training</h2>
          <h4>...track your training progress!</h4>
          If you&apos;re new to machine learning, here&apos;s a little hint:
          <br /> <em>An R-Squared value close to 1 is good!</em>
          <br /> <br />
          Training can take a while, so feel free to continue with <br />
          something else in the meantime.
        </div>
      ),
      offset: 2,
      target: '.apexcharts-canvas',
      placement: 'left',
    },
    {
      // Molecule creation step
      location: '/molecules',
      target: '.selection-list',
      content: (
        <div>
          <h2>Draw</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            molecule creation page
          </span>
          !<br /> Click on &quot;Add a molecule&quot; to get a blank canvas, or
          select a molecule in the list to edit it. <br />
          Just make sure to save it!
          <br />
          <br />
          After saving your changes, learn about your molecule&apos;s properties
          by clicking on the &quot;Analyze&quot; button.
        </div>
      ),
      placement: 'right',
    },
    {
      // Molecule analysis step
      location: '/trained-models',
      closeLocation: '/molecules',
      target: 'body',
      content: (
        <div>
          <h2>Analyze</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            Analysis page
          </span>
          !
          <br />
          Here you can see all the models you have trained so far. <br />
          Choose one to analyze your molecule from the previous step!
        </div>
      ),
      placement: 'center',
    },
    {
      // Comparison step
      location: '/results',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2>Compare</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            {' '}
            Scoreboard page
          </span>
          !<br />
          Here you can compare other user&apos;s models and molecules to your
          own. <br />
        </div>
      ),
    },
    {
      // End step
      location: '/home',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2>That&apos;s it!</h2>
          Feel free to explore the rest of the app and start creating your own
          models and molecules!
        </div>
      ),
    },
  ]

  return (
    <Joyride
      tooltipComponent={OnboardingTooltip}
      callback={internalCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      disableOverlayClose
      disableScrolling
      disableCloseOnEsc
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          arrowColor: theme.palette.primary.main,
          overlayColor: 'rgba(0, 0, 0, 0.33)',
          zIndex: 10000,
        },
      }}
    />
  )
}

Onboarding.propTypes = {
  run: PropTypes.bool,
  callback: PropTypes.func,
}
