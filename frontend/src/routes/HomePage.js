import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import SettingsIcon from '@mui/icons-material/Settings'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TimelineIcon from '@mui/icons-material/Timeline'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import Image from 'mui-image'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import HelpContext from '../context/HelpContext'
import { pulseAnim } from '../utils'

/**
 * Introductory page including credits, hints, links to core components
 * contains button to start onboarding
 * @param startOnboarding callback to initiate onboarding
 * @returns {JSX.Element}
 * @constructor
 */
export default function HomePage({ startOnboarding }) {
  const theme = useTheme()
  return (
    <Box sx={{ align: 'center', px: '10%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Box className="swing">
          <Image
            sx={{
              maxWidth: 250,
              p: 4,
            }}
            src={theme.home.mascot}
          />
        </Box>
        <Box>
          <Typography variant="h2">Hi! I&apos;m Molele!</Typography>
          <Typography variant="h6" color="text.secondary">
            Don&apos;t know how to get started?{' '}
            <Button
              variant="outlined"
              style={{
                fontSize: theme.typography.h6.fontSize,
                display: 'inline-block',
                textTransform: 'none',
              }}
              onClick={() => {
                startOnboarding()
              }}
            >
              Let me show you!
            </Button>
          </Typography>
        </Box>
      </Box>
      <HomePageStepper></HomePageStepper>
      <Box sx={{ mb: 12, mt: 5 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          To have individual components of MAChINE explained to you, click on
          the <HelpOutlineOutlinedIcon /> icon on the top right and then hover
          over the respective component with your mouse. To turn the
          explanations off, simply click on the button again.
        </Typography>
      </Box>
      <HomeCredits />
      <style>{`
        .swing {
          animation: swing 5s ease-in-out infinite;
        }
        @keyframes swing {
          0% {
            transform: rotate(0deg);
          }
          4% {
            transform: rotate(15deg);
          }
          8% {
            transform: rotate(-10deg);
          }
          12% {
            transform: rotate(5deg);
          }
          16% {
            transform: rotate(-5deg);
          }
          20% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </Box>
  )
}

const StepIconContainerShadow = styled('div')(({ theme, state }) => ({
  zIndex: 2,
  ...(state.active && {
    filter: `drop-shadow(0px 0px 10px ${
      theme.stepper.active + (theme.palette.mode === 'dark' ? '80' : 'B0')
    })`,
  }),
}))

// A hexagonal div
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
  }) /*,
  ...(ownerState.done && {
    // completed step (proper order)
    backgroundColor: theme.stepper.start,
  }) */ /*
  ...(ownerState.active && {
    // selected step, shown using box shadow
    backgroundColor: theme.stepper.active,
  }), */,
  ...(ownerState.isNext && {
    // recommended next step
    backgroundColor: theme.palette.primary.main,
    animation: `${pulseAnim} 1.5s ease-in-out infinite`,
  }),
  clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
}))

// Using a context here because MUI does not allow passing props from step to StepConnector, even though it's a child
const StepContext = React.createContext({
  fill: false,
  first: false,
  isNext: false,
})

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

function StepperIcon({ active, completed, isNext, done, icon }) {
  const Icon = icon
  return (
    <StepIconContainerShadow state={{ active }}>
      <StepIconContainer ownerState={{ completed, active, isNext, done }}>
        <Icon />
      </StepIconContainer>
    </StepIconContainerShadow>
  )
}

StepperIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  isNext: PropTypes.bool,
  done: PropTypes.bool,
  icon: PropTypes.node,
}

function HomePageStepper() {
  const navigate = useNavigate()

  const handleStep = () => {
    navigate(steps[activeStep].location)
  }
  const helpContext = React.useContext(HelpContext)

  const steps = [
    {
      label: 'Configure',
      description:
        'Configure custom machine learning models to predict properties of molecules',
      icon: SettingsIcon,
      location: '/models',
      buttonVerb: 'configuring',
      completed: helpContext.madeModel,
    },
    {
      label: 'Train',
      description: 'Train your custom models and watch them learn',
      icon: TimelineIcon,
      location: '/models',
      buttonVerb: 'training',
      completed: helpContext.madeFitting,
    },
    {
      label: 'Draw',
      description: 'Draw any molecule imaginable and preview it in 3D',
      icon: CreateIcon,
      location: '/molecules',
      buttonVerb: 'drawing',
      completed: helpContext.madeMolecule,
    },
    {
      label: 'Analyze',
      description:
        'Analyze your molecules for various properties with the models you trained',
      icon: AssessmentIcon,
      location: '/molecules',
      buttonVerb: 'analyzing',
      completed: helpContext.madeAnalysis,
    },
    {
      label: 'Compare',
      description:
        "Compare your molecules and models to other users' creations",
      icon: CompareArrowsIcon,
      location: '/results',
      buttonVerb: 'comparing',
      completed: helpContext.madeComparison,
    },
  ]

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
                  done: nextIndex > index,
                  icon,
                }}
                StepIconComponent={StepperIcon}
                color="theme.palette.primary.main"
                icon={icon}
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
          color="continue"
        >
          Start {steps[activeStep].buttonVerb}!
        </Button>
      </Box>
    </Box>
  )
}

HomePage.propTypes = {
  startOnboarding: PropTypes.func.isRequired,
}

function HomeCredits() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: 5,
        textAlign: 'left',
        mb: 5,
        px: '13%',
      }}
    >
      <Box>
        <Typography variant="h4" color="text.primary" paragraph>
          <span style={{ color: theme.palette.primary.main }}>MAChINE</span> was
          made for:
        </Typography>
        <Card>
          <CardMedia
            component="img"
            image="aimat_logo_purple.png"
            alt="dark purple"
            sx={{ p: 2, background: 'white' }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              AiMat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The AiMat (Artificial Intelligence for Materials sciences) group
              of KIT develops AI and machine learning solutions for the
              materials sciences and is the client for this web application.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              href="https://aimat.iti.kit.edu/"
              target="_blank"
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box sx={{ mt: 16 }}>
        <Typography variant="h4" color="text.primary" paragraph>
          by:
        </Typography>
        <Card>
          <CardMedia
            component="img"
            image="msg_logo_flat.png"
            alt="lightgreen"
          />
          <CardContent>
            <Typography gutterBottom varian="h5" component="div">
              Medium-sized Geckos
            </Typography>
            <Typography varaint="body2" color="text.secondary">
              This PSE project was created by the &apos;Medium-sized
              Geckos&apos; group, which consists mostly of members of the
              O-Phase group &apos;Team Gecko&apos;.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="https://team-gecko.de/" target="_blank">
              GECKO Homepage
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  )
}
