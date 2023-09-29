import React from 'react'
import { Box } from '@mui/material'
import api from '../api'
import BaseModelCard from '../components/models/BaseModelCard'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import { useNavigate } from 'react-router-dom'

/**
 * Selection component for base models
 * Navigates to /models/model-config on selection
 * @returns {JSX.Element}
 */
export default function BaseModelsPage() {
  const [modelArray, setModelArray] = React.useState([])
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)
  const navigate = useNavigate()

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      setModelArray(sentModels)
    })
  }, [])

  const handleHelpPopperOpen = (target, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(target)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const handleClick = (baseModel) => {
    navigate('/models/model-config', { state: { baseModel } })
  }
  return (
    <Box sx={{ m: 5 }}>
      {help.helpMode ? <h1>Click to select</h1> : null}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 5,
        }}
      >
        {modelArray.map((baseModel) => (
          <BaseModelCard
            baseModel={baseModel}
            key={baseModel.id}
            clickFunc={handleClick}
            hoverFunc={(target) => {
              handleHelpPopperOpen(
                target,
                "Click here to select this base model. Don't worry, you'll get to configure its parameters on the next page!"
              )
            }}
            leaveFunc={handleHelpPopperClose}
          />
        ))}
      </Box>
      <HelpPopper
        id="helpPopper"
        helpPopperContent={helpPopperContent}
        open={Boolean(helpAnchorEl)}
        anchorEl={helpAnchorEl}
        onClose={handleHelpPopperClose}
      />
    </Box>
  )
}
