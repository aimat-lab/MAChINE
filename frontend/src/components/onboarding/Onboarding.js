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
      // If the step requires a certain location, navigate to it
      if (steps[index].location) {
        navigate(
          steps[stepIndex].location,
          steps[stepIndex].params ? steps[stepIndex].params : {}
        )
      }
    }
    // Advance (or go back) to the next step
    // Also do this if the target is not found, so the tour can continue
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }

    // Call external callback
    callback(data)
  }
  /*
  // The steps of the tour
  // steps with skipLocations will be skipped if the current location matches one of the skipLocations
  // steps with location will navigate to the specified location
  // params can be passed to the location
  const steps = [
    {
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
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>Navbar</span>
          </h2>
          This is where you can navigate to different pages in the app.
          <br />
          It also allows you to log out and switch between light and dark mode.
        </div>
      ),
      spotlightPadding: 0,
      target: '.MuiToolbar-root',
    },
    {
      content: (
        <div>
          <h2>
            Let&apos;s go to the{' '}
            <span style={{ color: theme.palette.primary.main }}>Models</span>{' '}
            page
          </h2>
        </div>
      ),
      spotlightPadding: 0,
      target: "a[href$='/models']",
      skipLocations: ['/models'],
    },
    {
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>Models</span>{' '}
            page
          </h2>
          Here you can view all the models you have created, select a model for
          training, and create new models.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models',
    },
    {
      content: <h2>You can add a new model using this button</h2>,
      target: 'button[aria-label="Add item"]',
      location: '/models',
    },
    {
      content: (
        <div>
          <h2>
            Next is selecting a{' '}
            <span style={{ color: theme.palette.primary.main }}>
              base model
            </span>
          </h2>
          Your new model will be based on this pre-configured model.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>
              Sequential
            </span>{' '}
            base model
          </h2>
          It&apos;s the simplest model type, consisting of a single stack of
          layers. <br />
          However, it offers the most customization options in MAChINE.
        </div>
      ),
      target: '.base-model-card.id-1',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>SchNet</span>{' '}
            base model
          </h2>
          SchNet is short for Schrödinger Network. Consisting of a graph neural
          network and a multilayer-perceptron (MLP) component, it&apos; more
          complex than the Sequential model, but also more powerful.
        </div>
      ),
      target: '.base-model-card.id-2',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>
              model configuration
            </span>{' '}
            page
          </h2>
          Here you can configure various properties of your model.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models/model-config',
      params: {
        state: {
          baseModel: {
            name: 'SequentialA',
            type: { name: 'sequential', image: null },
            parameters: {
              lossFunction: 'Mean Squared Error',
              optimizer: 'Adam',
              layers: [
                { type: 'Dense', units: 256, activation: 'relu' },
                {
                  type: 'Dense',
                  units: 256,
                  activation: 'relu',
                },
                { type: 'Dense', units: 256, activation: 'relu' },
                { type: 'Dense', units: 1 },
              ],
            },
            id: '1',
          },
        },
      },
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>
              Network Visualizer
            </span>
            ...
          </h2>
          allows you to add & remove layers and set their activation functions.
        </div>
      ),
      target: '.vis-network',
    },
    {
      content: (
        <div>
          <h2>
            Once you&apos;ve configured your new model, you can start{' '}
            <span style={{ color: theme.palette.primary.main }}>training</span>{' '}
            it
          </h2>
        </div>
      ),
      location: '/models',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            First, select the model, then click this{' '}
            <span style={{ color: theme.palette.primary.main }}>button</span>
          </h2>
        </div>
      ),
      target: '.select-training-data',
    },
    {
      content: (
        <div>
          <h2>
            Next, pick a{' '}
            <span style={{ color: theme.palette.primary.main }}>dataset</span>{' '}
            for training{' '}
          </h2>
        </div>
      ),
      location: '/datasets',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            The dataset determines which{' '}
            <span style={{ color: theme.palette.primary.main }}>
              properties
            </span>{' '}
            of the molecules your model can predict and how well.
          </h2>
        </div>
      ),
      location: '/datasets',
      target: 'button.MuiCardActionArea-root',
    },
    {
      content: (
        <div>
          <h2>
            It&apos;s{' '}
            <span style={{ color: theme.palette.primary.main }}>training</span>{' '}
            time!
          </h2>
          This page allows you to train your model on the selected dataset.
        </div>
      ),
      location: '/training',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            <span style={{ color: theme.palette.primary.main }}>Before</span>{' '}
            you start training...
          </h2>
          you can set the number of epochs and the batch size
          <br /> as well as review your selected model and dataset.
        </div>
      ),
      target: '.MuiGrid-item.MuiGrid-grid-xs-6',
      placement: 'right',
    },
    {
      content: (
        <div>
          <h2>
            <span style={{ color: theme.palette.primary.main }}>Once</span> you
            start training...
          </h2>
          you will see live updates of the training progress in the graph.
        </div>
      ),
      target: '.apexcharts-canvas',
      placement: 'left',
    },
    {
      content: (
        <div>
          <h2>
            Next is{' '}
            <span style={{ color: theme.palette.primary.main }}>molecule</span>{' '}
            creation!
          </h2>
        </div>
      ),
      location: '/molecules',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            You can{' '}
            <span style={{ color: theme.palette.primary.main }}>draw</span> any
            molecule you like
          </h2>
          Feel free to play around!
        </div>
      ),
      target: '.molecule-view',
    },
    {
      content: (
        <div>
          <h2>
            When you&apos;re happy with your molecule, hit{' '}
            <span style={{ color: theme.palette.primary.main }}>analyze</span>
          </h2>
          You will be able to analyze your new molecule with any of your trained
          models and view the results.
        </div>
      ),
      target: '.analyze-button',
    },
    {
      content: (
        <div>
          <h2>
            Finally, you can{' '}
            <span style={{ color: theme.palette.primary.main }}>compare</span>{' '}
            your molecules and models to those of other users.
          </h2>
        </div>
      ),
      location: '/results',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            One last thing:{' '}
            <span style={{ color: theme.palette.primary.main }}>Help mode</span>
            !
          </h2>
          Help mode will give you hints on parameters and panels simply by
          hovering above them. You can always toggle it using this button.
        </div>
      ),
      target: '.help-mode-button',
    },
    {
      content: (
        <div>
          <h2>
            That&apos;s it!{' '}
            <span style={{ color: theme.palette.primary.main }}>Enjoy</span>!
          </h2>
          Thank you for choosing MAChINE for your daily AI molecule property
          prediction needs!
        </div>
      ),
      location: '/models',
      target: 'body',
      placement: 'center',
    },
  ]
*/
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
            <span style={{ color: theme.palette.primary.main }}>stepper</span>
          </h2>
          The stepper shows you what you&apos;ve already achieved with our app!
          <br />
          It also gives you handy suggestions on what steps to do next.
          <br />
          Let&apos;s get a quick overview!
        </div>
      ),
    },
    {
      // Models page step
      location: '/models',
      target: 'body',
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
    },
    {
      // Model creation step
      location: '/models/base-models',
      target: 'body',
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
      target: 'body',
      content: (
        <div>
          <h2>Training</h2>
          Back on the models page, click on &quot;Select Training Data&quot; to
          select a dataset to train your model on.
        </div>
      ),
    },
    {
      // Dataset selection step
      location: '/datasets',
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
      target: 'body',
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
          later: <em>Getting your Accuracy close to 1 is good!</em>
          <br /> <br />
          You can either stay here and watch the graph while your model trains,{' '}
          <br />
          or you can do something else and come back later.
        </div>
      ),
      offset: 2,
      target: '.apexcharts-canvas',

      placement: 'left',
    },
    {
      // Molecule creation step
      location: '/molecules',
      target: 'body',
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
    },
    {
      // Molecule analysis step
      location: '/trained-models',
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
    },
    {
      // Comparison step
      location: '/results',
      target: 'body',
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
