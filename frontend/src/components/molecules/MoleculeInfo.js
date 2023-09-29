import React from 'react'
import { Divider, List, ListItem, ListItemText } from '@mui/material'
import AnalysisInfo from './AnalysisInfo'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

/**
 * a simple list of the trained models attached to the given molecule
 * @param molecule a molecule object containing molecule and trainend model info
 * @returns {JSX.Element} a list of trained models with entries that can be clicked to expand and show label details
 * @constructor
 */
export default function MoleculeInfo({ molecule }) {
  const { t, i18n } = useTranslation('moleculesPage')

  return (
    <List sx={{ maxHeight: '55vh', overflow: 'auto' }}>
      {molecule.analyses.length !== 0 ? (
        <>
          <ListItem>
            <ListItemText primary={t('moleculeInfo.heading')} />
          </ListItem>
          <Divider />
        </>
      ) : (
        <ListItem>
          <ListItemText primary={t('moleculeInfo.noAnalyses')} />
        </ListItem>
      )}
      {
        // create a list entry for each trained model
        molecule.analyses.map((analysis, i) => {
          return (
            <React.Fragment
              key={`${molecule.smiles}-${analysis.fittingID}-${i}`}
            >
              {i === 0 ? null : <Divider></Divider>}
              <AnalysisInfo analysis={analysis}></AnalysisInfo>
            </React.Fragment>
          )
        })
      }
    </List>
  )
}

MoleculeInfo.propTypes = {
  molecule: PropTypes.object.isRequired,
}
