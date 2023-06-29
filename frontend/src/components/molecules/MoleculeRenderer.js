import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { Kekule } from 'kekule'
import 'kekule/theme/default'
import * as THREE from 'three'

Kekule.externalResourceManager.register('three.js', THREE)
// the chemviewer is the actual 3D renderer
const chemViewer = new Kekule.ChemWidget.Viewer3D(document)
chemViewer.setDrawDimension('100%', '100%')
chemViewer.setEnableToolbar(true)
// only allow these tools
chemViewer.setToolButtons([
  'molDisplayType',
  'zoomIn',
  'zoomOut',
  'rotateLeft',
  'rotateRight',
  'rotateX',
  'rotateY',
  'rotateZ',
])
chemViewer.setAllowedMolDisplayTypes([
  Kekule.Render.Molecule3DDisplayType.BALL_STICK,
  Kekule.Render.Molecule3DDisplayType.STICKS,
  Kekule.Render.Molecule3DDisplayType.SPACE_FILL,
])

/**
 * Creates a box containing a 3D Molecule Viewer from "Kekule"
 * @param moleculeDoc a "Kekule" molecule object used for inputting the molecule info
 * @param width the width of the viewer, this should be static
 * @param height the hieght of the viewer, this should be static too
 * @returns {JSX.Element} a box containing the 3D molecule viewer with a fixed size
 * @constructor
 */
export default function MoleculeRenderer({ moleculeDoc, width, height }) {
  React.useEffect(() => {
    // defining the root object where the 3D viewer should be rendered into
    chemViewer.appendToElem(document.getElementById('renderer'))
  }, [])

  React.useEffect(() => {
    chemViewer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  // return an empty box, the content will be rendered in later using a useEffect
  return <Box id="renderer" sx={{ width, height }} />
}

MoleculeRenderer.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
