import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import logo from '../../logo.svg'
import PropTypes from 'prop-types'
import ServerStatusButton from './ServerStatusButton'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import LogoutIcon from '@mui/icons-material/Logout'
import ProgressBar from '../training/ProgressBar'

const links = {
  home: {
    link: '/home',
    label: 'Home',
  },
  models: {
    link: '/models',
    label: 'Models',
  },
  molecules: {
    link: '/molecules',
    label: 'Molecules',
  },
  results: {
    link: '/results',
    label: 'Scoreboards',
  },
  chartsTest: {
    link: '/charts',
    label: 'Charts Test',
  },
  training: {
    link: '/training',
    label: 'Training',
    hidden: true,
  },
}

export default function Navbar({ logoutFunction, darkModeButton }) {
  const locationName = useLocation().pathname
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)

  // Navigates the user to the start page on page reload
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/')
  }, [])

  React.useEffect(() => {
    locationName === links.training.link || training.trainingStatus
      ? (links.training.hidden = false)
      : (links.training.hidden = true)
  }, [locationName, training.trainingStatus])

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <img src={logo} height="30px" style={{ marginRight: 10 }} />
        {!(locationName !== '/' || user.userName) ? null : (
          <>
            {Object.entries(links).map(([key, value]) => (
              <>
                {value.hidden ? null : (
                  <NavLink
                    to={value.link}
                    key={value.label}
                    style={({ isActive }) =>
                      isActive
                        ? { fontWeight: 600, paddingLeft: 10, paddingRight: 10 }
                        : { paddingLeft: 10, paddingRight: 10 }
                    }
                  >
                    {value.label}
                  </NavLink>
                )}
              </>
            ))}
            {!training.trainingStatus ? null : (
              <>
                <Box sx={{ width: '10%', ml: 1 }}>
                  <ProgressBar />
                </Box>
              </>
            )}
          </>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
        {!user.userName ? null : (
          <>
            {user.userName}
            <NavLink key="logout" to="/" onClick={() => logoutFunction()}>
              <IconButton sx={{ color: 'white' }}>
                <LogoutIcon />
              </IconButton>
            </NavLink>
          </>
        )}
        <ServerStatusButton />
        {darkModeButton}
      </Toolbar>
      <style jsx="true">{`
        a {
          color: white;
          text-decoration: none;
          padding-left: 10px;
        }
        a.active {
          font-weight: bold;
        }
      `}</style>
    </AppBar>
  )
}

Navbar.propTypes = {
  logoutFunction: PropTypes.func.isRequired,
  darkModeButton: PropTypes.element,
}
