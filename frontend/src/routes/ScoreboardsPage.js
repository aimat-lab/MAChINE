import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import PropTypes from 'prop-types'
import BestModels from '../components/scoreboard/BestModels'
import BestMolecules from '../components/scoreboard/BestMolecules'
import api from '../api'

/**
 * Displays a tabbed view of the best models and best molecules
 * @returns {JSX.Element} box containing an admin panel and tabs
 */
export default function ScoreboardsPage() {
  const [activeTab, setActiveTab] = React.useState(0)
  const [datasets, setDatasets] = React.useState([])
  const [labels, setLabels] = React.useState(new Set())

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
      <Tabs value={activeTab} onChange={handleChange}>
        <Tab label="Best Models" />
        <Tab label="Best Molecules" />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <BestModels datasets={datasets} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <BestMolecules labels={[...labels]} />
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
