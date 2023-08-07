import React from 'react'
import PropTypes from 'prop-types'

/**
 * provides information about the helpMode being active and other tutorial actions
 * @type {React.Context<{setHelpMode: setHelpMode, helpMode: boolean}>}
 */
const HelpContext = React.createContext({
  helpMode: false,
  setHelpMode: () => {},
  madeModel: false,
  setMadeModel: () => {},
  madeFitting: false,
  setMadeFitting: () => {},
  madeMolecule: false,
  setMadeMolecule: () => {},
  madeAnalysis: false,
  setMadeAnalysis: () => {},
  madeComparisons: false,
  setMadeComparisons: () => {},
})

export const HelpProvider = ({ children }) => {
  const [helpMode, setHelpMode] = React.useState(false)
  const [madeModel, setMadeModel] = React.useState(false)
  const [madeFitting, setMadeFitting] = React.useState(false)
  const [madeMolecule, setMadeMolecule] = React.useState(false)
  const [madeAnalysis, setMadeAnalysis] = React.useState(false)
  const [madeComparisons, setMadeComparisons] = React.useState(false)

  return (
    <HelpContext.Provider
      value={{
        helpMode,
        setHelpMode,
        madeModel,
        setMadeModel,
        madeFitting,
        setMadeFitting,
        madeMolecule,
        setMadeMolecule,
        madeAnalysis,
        setMadeAnalysis,
        madeComparisons,
        setMadeComparisons,
      }}
    >
      {children}
    </HelpContext.Provider>
  )
}

HelpProvider.propTypes = {
  children: PropTypes.any,
}

export default HelpContext
