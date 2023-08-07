import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import UserContext from '../context/UserContext'
import PropTypes from 'prop-types'
import BestModels from '../components/scoreboard/BestModels'
import AdminPanel from '../components/scoreboard/AdminPanel'
import BestMolecules from '../components/scoreboard/BestMolecules'
import api from '../api'

/**
 * Displays an admin panel when in admin mode and a tabbed view of the best models and best molecules
 * @returns {JSX.Element} box containing an admin panel and tabs
 */
export default function ScoreboardsPage() {
  const [activeTab, setActiveTab] = React.useState(0)
  const [datasets, setDatasets] = React.useState([])
  const [labels, setLabels] = React.useState(new Set())
  const { adminMode } = React.useContext(UserContext)

  const refreshFuncs = { 0: null, 1: null }

  React.useEffect(() => {
    api.getDatasets().then((datasetList) => {
      setDatasets(datasetList)
      setLabels(
        new Set(datasetList.map((dataset) => dataset.labelDescriptors).flat())
      )
    })
  }, [])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        mx: 4,
        mb: 4,
        mt: 1,
        '& .table-theme': {
          fontWeight: 'bold',
        },
      }}
    >
      {adminMode ? <AdminPanel refreshFunc={refreshFuncs[activeTab]} /> : null}
      <Tabs value={activeTab} onChange={handleChange}>
        <Tab label="Best Models" />
        <Tab label="Best Molecules" />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <BestModels
          passRefreshFunc={(refreshFunc) => {
            refreshFuncs[0] = refreshFunc
          }}
          datasets={datasets}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <BestMolecules
          passRefreshFunc={(refreshFunc) => {
            refreshFuncs[1] = refreshFunc
          }}
          labels={[...labels]}
        />
      </TabPanel>
    </Box>
  )
}

/**
 * Component for contents of a Tab
 * @param children component to be displayed on tab
 * @param value current selected tab
 * @param index index of this tab
 * @param other other props
 * @returns {JSX.Element}
 */
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
