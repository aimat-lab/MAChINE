import React from 'react'
import { useTheme } from '@mui/material'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import Joyride, { ACTIONS, EVENTS } from 'react-joyride'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import OnboardingTooltip from './OnboardingTooltip'

export default function Onboarding({ run, callback }) {
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()
  const locationName = useLocation().pathname
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
    // Skip the step if it's skipLocation matches the current location
    if (EVENTS.STEP_BEFORE === type) {
      if (
        steps[index].skipLocations &&
        steps[index].skipLocations.includes(locationName)
      ) {
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
      }
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
      console.log('Onboarding closed')
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
          This tour will guide you through the most important features of the
          app.
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
          them, <br />
          it might shed a light on some of the more technical aspects of
          MAChINE. <br />
          Help mode has been turned on by this tour, but you can always toggle
          it by using this button.
        </div>
      ),
    },
    {
      // Stepper step
      location: '/home',
      target: '.MuiStepper-root',
      offset: 5,
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
          It also gives you handy suggestions on what steps to do next.
          <br />
          Let&apos;s go through all the steps together!
        </div>
      ),
    },
    {
      // Models page step
      location: '/models',
      target: '.selection-list',
      content: (
        <div>
          <h2>Configure</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>models page</span>
          !<br />
          Here you can see all the models you have created so far. <br />
          To create a model, simply click on &quot;Add a model&quot; and
          you&apos;ll be led to the next step.
        </div>
      ),
      placement: 'right',
    },
    {
      // Model creation step
      location: '/models/base-models',
      target: 'body',
      placement: 'center',
      content: (
        <div>
          <h2>Configure</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            Base model page
          </span>{' '}
          !<br />
          Here you can see all the base models you can select from. <br />
          Base models are the building blocks of your model, they define the
          type and parameters you can customize. <br />
          Click on the base model you want to use and you&apos;ll be redirected
          to its configuration page. <br />
          But let&apos;s skip that for now and go straight to the next step!
        </div>
      ),
    },
    {
      // Model page training step
      location: '/models',
      target: '.select-training-data',
      content: (
        <div>
          <h2>Training</h2>
          Back on the models page, click on &quot;Select Training Data&quot; to
          select a dataset to train your model on.
        </div>
      ),
      placement: 'top',
    },
    {
      // Dataset selection step
      location: '/datasets',
      closeLocation: '/models',
      placement: 'center',
      target: 'body',
      content: (
        <div>
          <h2>Training</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            {' '}
            dataset selection page
          </span>
          ! <br />
          Here you can see all the datasets available to you. <br />
          Click on a dataset, select a label that sounds interesting and you can
          start training! <br />
        </div>
      ),
    },
    {
      // Training step
      location: '/training',
      closeLocation: '/models',
      target: '.training-overview-parameters',
      content: (
        <div>
          <h2>Training</h2>
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            training page
          </span>
          !<br />
          Here you have an overview of your model, the dataset you selected{' '}
          <br />
          and...
        </div>
      ),
      placement: 'right',
    },
    {
      // Training graph step
      content: (
        <div>
          <h2>Training</h2>
          <h4>...the training process!</h4>
          This neat little graph shows you how your model is doing. <br />
          Even if you&apos;re not deep into machine learning, <br />
          you can still look at all the pretty colors! <br />A small hint for
          later: <em>Getting your R-Squared close to 1 is good!</em>
          <br /> <br />
          You can either stay here and watch the graph while your model trains,{' '}
          <br />
          or you can do something else and come back later.
        </div>
      ),
      offset: 2,
      target: '.apexcharts-canvas',
      placement: 'left',
      closeLocation: '/models',
    },
    {
      // Molecule creation step
      location: '/molecules',
      target: '.selection-list',
      content: (
        <div>
          <h2>Draw</h2>
          Here&apos;s a suggestion for something else you can do:
          <br />
          Draw your own molecules! (And look at their 3D structure, too)
          <br />
          This is the{' '}
          <span style={{ color: theme.palette.primary.main }}>
            molecule creation page
          </span>
          !<br /> Click on &quot;Add a molecule&quot; to get a blank canvas, or
          click on a molecule in the list to edit it. <br />
          Just make sure to save it! You wouldn&apos;t want to lose your work,
          would you?
          <br />
          <br />
          Once you&apos;re happy with you molecule, you can analyze it by
          clicking on the &quot;Analyze&quot; button (after saving).
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
          Click on a model to analyze your molecule from the previous step!
          <br />
          <br />
          Since you probably haven&apos;t trained any models yet, this page is
          rather boring right now.
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
          Here you can see models other users have trained and compare them to
          your own. <br />
          You can also compare molecules, to see which one is the best! <br />
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
