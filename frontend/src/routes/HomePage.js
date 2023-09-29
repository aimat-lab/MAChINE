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
import { Trans, useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('homePage')

  const steps = [
    {
      label: t('stepper.configure.label'),
      description: t('stepper.configure.description'),
      icon: SettingsIcon,
      location: '/models',
      buttonVerb: t('stepper.configure.verb'),
      completed: help.madeModel,
    },
    {
      label: t('stepper.train.label'),
      description: t('stepper.train.description'),
      icon: TimelineIcon,
      location: '/models',
      buttonVerb: t('stepper.train.verb'),
      completed: help.madeFitting,
    },
    {
      label: t('stepper.draw.label'),
      description: t('stepper.draw.description'),
      icon: CreateIcon,
      location: '/molecules',
      buttonVerb: t('stepper.draw.verb'),
      completed: help.madeMolecule,
    },
    {
      label: t('stepper.analyze.label'),
      description: t('stepper.analyze.description'),
      icon: AssessmentIcon,
      location: '/molecules',
      buttonVerb: t('stepper.analyze.verb'),
      completed: help.madeAnalysis,
    },
    {
      label: t('stepper.compare.label'),
      description: t('stepper.compare.description'),
      icon: CompareArrowsIcon,
      location: '/results',
      buttonVerb: t('stepper.compare.verb'),
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
          <Typography variant="h2">{t('molele.greeting')}</Typography>
          <Typography variant="h6" color="text.secondary">
            {t('molele.dontKnow')}{' '}
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
              {t('molele.letMe')}
            </Button>
          </Typography>
        </Box>
      </Box>
      <HomePageStepper steps={steps} />
      <Box
        sx={{
          mb: 12,
          mt: 5,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
          align="center"
        >
          <Trans i18nKey="homePage:helpIcon">
            Dummy text
            <HelpOutlineOutlinedIcon />
            More Dummy Text
          </Trans>
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
  const { t } = useTranslation('homePage')
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
          <Trans i18nKey="homePage:credits.client">
            <span style={{ color: theme.palette.primary.main }}>MAChINE </span>
            was made for:
          </Trans>
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
              {t('credits.aimat.name')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('credits.aimat.description')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              href="https://aimat.iti.kit.edu/"
              target="_blank"
            >
              {t('common:buttons.learnMore')}
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box sx={{ mt: 16 }}>
        <Typography variant="h4" color="text.primary" paragraph>
          {t('credits.developer')}
        </Typography>
        <Card>
          <CardMedia
            component="img"
            image="msg_logo_flat.png"
            alt="lightgreen"
          />
          <CardContent>
            <Typography gutterBottom varian="h5" component="div">
              {t('credits.msg.name')}
            </Typography>
            <Typography varaint="body2" color="text.secondary">
              {t('credits.msg.description')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="https://team-gecko.de/" target="_blank">
              {t('credits.msg.homepage')}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  )
}
