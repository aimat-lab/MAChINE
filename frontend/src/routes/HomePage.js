import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import SettingsIcon from '@mui/icons-material/Settings'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TimelineIcon from '@mui/icons-material/Timeline'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import HomePageStepper from '../components/misc/HomePageStepper'
import Image from 'mui-image'
import PropTypes from 'prop-types'
import HelpContext from '../context/HelpContext'

/**
 * Introductory page including credits, hints, links to core components
 * contains button to start onboarding
 * @param startOnboarding callback to initiate onboarding
 * @returns {JSX.Element}
 * @constructor
 */
export default function HomePage({ startOnboarding }) {
  const theme = useTheme()
  const help = React.useContext(HelpContext)

  const steps = [
    {
      label: 'Configure',
      description:
        'Configure custom machine learning models to predict properties of molecules',
      icon: SettingsIcon,
      location: '/models',
      buttonVerb: 'configuring',
      completed: help.madeModel,
    },
    {
      label: 'Train',
      description: 'Train your custom models and watch them learn',
      icon: TimelineIcon,
      location: '/models',
      buttonVerb: 'training',
      completed: help.madeFitting,
    },
    {
      label: 'Draw',
      description: 'Draw any molecule imaginable and preview it in 3D',
      icon: CreateIcon,
      location: '/molecules',
      buttonVerb: 'drawing',
      completed: help.madeMolecule,
    },
    {
      label: 'Analyze',
      description:
        'Analyze your molecules for various properties with the models you trained',
      icon: AssessmentIcon,
      location: '/molecules',
      buttonVerb: 'analyzing',
      completed: help.madeAnalysis,
    },
    {
      label: 'Compare',
      description:
        "Compare your molecules and models to other users' creations",
      icon: CompareArrowsIcon,
      location: '/results',
      buttonVerb: 'comparing',
      completed: help.madeComparison,
    },
  ]

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
                help.setHelpMode(true)
                startOnboarding()
              }}
            >
              Let me show you!
            </Button>
          </Typography>
        </Box>
      </Box>
      <HomePageStepper steps={steps} />
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
