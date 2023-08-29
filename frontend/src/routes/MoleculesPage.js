import React from 'react'
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  useTheme,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import api from '../api'
import Molecule from '../internal/Molecule'
import SelectionList from '../components/shared/SelectionList'
import MoleculeEditor from '../components/molecules/MoleculeEditor'
import MoleculeRenderer from '../components/molecules/MoleculeRenderer'
import SnackBarAlert from '../components/misc/SnackBarAlert'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import UserContext from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Kekule } from 'kekule'
import { pulseAnim } from '../utils'

const gridHeight = '85vh'

export default function MoleculesPage() {
  const [molecules, setMolecules] = React.useState([])
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [selectedMolecule, setSelectedMolecule] = React.useState(null)
  const [snackMessage, setSnackMessage] = React.useState('')
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [snackSeverity, setSnackSeverity] = React.useState('warning')
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const user = React.useContext(UserContext)
  const help = React.useContext(HelpContext)

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  React.useEffect(() => {
    refreshMolecules()
  }, [user])

  function refreshMolecules(addedMol) {
    api.getMoleculeList().then((moleculeList) => {
      setMolecules(moleculeList)
      if (addedMol) {
        setSelectedMolecule(addedMol)
        setSelectedIndex(moleculeList.length - 1)
      }
    })
  }

  function onMoleculeSelect(index) {
    const molecule = molecules[index]
    if (molecule !== undefined) {
      const copy = new Molecule(
        molecule.name,
        molecule.smiles,
        molecule.cml,
        molecule.analyses
      )
      setSelectedMolecule(copy)
    } else {
      setSelectedMolecule(new Molecule(null, null, null, null))
    }
  }

  function showSnackMessage(message, severity) {
    setShowSnackBar(true)
    setSnackMessage(message)
    setSnackSeverity(severity)
  }

  function saveMolecule(molName, smiles, cml, overwrite) {
    // Find a duplicate
    const duplicates = molecules.filter((mol) => {
      return mol.smiles === smiles || mol.cml === cml || mol.name === molName
    })

    if (duplicates.length > 0 && !overwrite) {
      showSnackMessage(
        `Molecule already saved as "${duplicates[0].name}". Save again to overwrite any duplicates.`,
        'warning'
      )
      return true
    } else if (!molName || !smiles || !cml) {
      showSnackMessage(`Can't save molecule.`, 'error')
    } else {
      // Deletes every name/cml/smiles duplicate
      while (duplicates.length > 0) {
        api.deleteMolecule(duplicates.pop().smiles)
      }
      api
        .addMolecule(smiles, cml, molName)
        .then(() => {
          refreshMolecules(new Molecule(molName, smiles, cml))
          help.setMadeMolecule(true)
        })
        .catch(() =>
          showSnackMessage(
            `Can't save invalid molecule. Check for errors in the editor`,
            'error'
          )
        )
    }
  }

  return (
    <Box sx={{ m: 2 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        columnSpacing={2}
      >
        {/** Shows all created molecules (on the left) **/}
        <Grid
          item
          md={3}
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              'This shows all molecules you have created so far. Click on the i-Icon to see more information about a molecule.'
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <SelectionList
            elements={molecules}
            elementType="molecule"
            usePopper={true}
            addFunc={() => onMoleculeSelect(-1)}
            updateFunc={(index) => onMoleculeSelect(index)}
            height={gridHeight}
            forcedSelectedIndex={selectedIndex}
            animateAdd={help.helpMode && !help.madeMolecule}
          ></SelectionList>
        </Grid>
        {/** The molecule creator (using kekule) on the right of the page **/}
        <Grid
          item
          md={9}
          key="molecule-view"
          className="molecule-view"
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              "This is your molecule sandbox! Let your creativity flow and create the molecule of your dreams.\nClick on the line-icon on the left to create new bonds, on the C-icon to change an atom, or on the eraser-icon to delete things.\nWhen you're happy with your molecule, give it a name and save it!\nSaved molecules can be analyzed by the models you have trained with a click on the button 'Analyze' in the bottom right corner."
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <MoleculeView
            className="molecule-view"
            selectedMolecule={selectedMolecule}
            onSave={saveMolecule}
          />
        </Grid>
        <HelpPopper
          id="helpPopper"
          helpPopperContent={helpPopperContent}
          open={Boolean(helpAnchorEl)}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Grid>
      <SnackBarAlert
        message={snackMessage}
        onClose={() => setShowSnackBar(false)}
        open={showSnackBar}
        severity={snackSeverity}
      />
    </Box>
  )
}

/**
 * Component Card displaying the 2D-Editor or 3D-Viewer and buttons
 * @param selectedMolecule {Molecule} Molecule displayed in the View
 * @param onSave {function} Function called when the "Save" Button is pressed
 * @returns {JSX.Element} Card displaying the 2D-Editor or 3D-Viewer and buttons
 */
function MoleculeView({ selectedMolecule, onSave }) {
  const [editorHeight, editorWidth] = ['70vh', '100%']
  const [moleculeDoc, setMoleculeDoc] = React.useState(null)
  const [viewerDoc, setViewerDoc] = React.useState(null)
  const [converting, setConverting] = React.useState(false)
  const [molName, setMolName] = React.useState('')
  const [show3D, setShow3D] = React.useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const help = React.useContext(HelpContext)

  const [overwrite, setOverwrite] = React.useState(false)

  React.useEffect(() => {
    // Every time a molecule is supposed to be drawn, a new ChemDocument is created. (Easiest solution for handling kekule molecules)
    // Onto the new canvas, the selected molecule is drawn.
    const chemDocument = new Kekule.ChemDocument()
    if (selectedMolecule && selectedMolecule.cml) {
      chemDocument.appendChild(
        Kekule.IO.loadFormatData(selectedMolecule.cml, 'cml')
      )
    }
    setMoleculeDoc(chemDocument)
  }, [selectedMolecule])

  /**
   * Saves a molecule by extracting the first child from the Kekule ChemDocument and converting it to SMILES & CML codes
   * @param event submit HTML event
   */
  function saveMol(event) {
    event.preventDefault()
    try {
      const molecule = moleculeDoc.getChildAt(0)
      const smiles = Kekule.IO.saveFormatData(molecule, 'smi')
      const cml = Kekule.IO.saveFormatData(molecule, 'cml')
      const duplicate = onSave(molName, smiles, cml, overwrite)
      if (duplicate && !overwrite) {
        setOverwrite(true)
      } else {
        changeMolName('')
      }
    } catch (e) {
      onSave('', '', '')
    }
  }

  function changeMolName(name) {
    if (overwrite) {
      setOverwrite(false)
    }
    setMolName(name)
  }

  /**
   * Updates the chemDocument shown by the 3D viewer by sending the current molecule to the backend for conversion.
   * In case the molecule can't be converted, it uses the regular 3D-ification provided by Kekule.
   * If there is no drawn molecule, it makes sure the 3D View is blank.
   * @returns {Promise<AxiosResponse<*> | void>} A promise that's resolved when the api call is done. Or nothing
   */
  async function updateViewerDoc() {
    if (moleculeDoc && moleculeDoc.getChildCount() > 0) {
      const smiles = Kekule.IO.saveFormatData(moleculeDoc.getChildAt(0), 'smi')
      return api.get3DMolecule(smiles).then((converted) => {
        if (converted) {
          setViewerDoc(Kekule.IO.loadFormatData(converted, 'cml'))
        } else {
          setViewerDoc(moleculeDoc)
        }
      })
    } else {
      setViewerDoc(new Kekule.ChemDocument())
    }
  }

  /**
   * Function called when switching between 2D and 3D views.
   * Handles variable changes required for the process to work.
   */
  async function changeView() {
    if (!show3D) {
      setConverting(true)
      updateViewerDoc()
        .then(() => setShow3D(true))
        .finally(() => setConverting(false))
    } else {
      setShow3D(false)
    }
  }

  React.useEffect(() => {
    updateViewerDoc().then()
  }, [moleculeDoc])

  return (
    <Card sx={{ maxHeight: gridHeight, height: gridHeight, overflow: 'auto' }}>
      <CardContent>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {show3D === true ? (
            <MoleculeRenderer
              moleculeDoc={viewerDoc}
              width={editorWidth}
              height={editorHeight}
            />
          ) : (
            <Box
              sx={{
                // Kekule has no inherent darkmode. If the user has darkmode activated,
                // we invert the colors of the molecule editor by hand.
                filter: theme.darkMode ? 'invert(.86)' : false,
              }}
            >
              <MoleculeEditor
                moleculeDoc={moleculeDoc}
                width={editorWidth}
                height={editorHeight}
              />
            </Box>
          )}
        </Box>
        <Backdrop
          sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={selectedMolecule === null}
        >
          Select a molecule or add one on the left to view & edit it here .
        </Backdrop>
      </CardContent>
      <CardActions>
        <Box
          component="form"
          onSubmit={saveMol}
          sx={{ display: 'inherit', ml: 4 }}
        >
          <TextField
            label="Molecule Name"
            variant="standard"
            value={molName}
            onChange={(e) => changeMolName(e.target.value)}
            inputProps={{ maxLength: 21 }}
          />
          <Button
            size="large"
            variant="outlined"
            type="submit"
            endIcon={<SaveIcon />}
            disabled={!molName}
            sx={{ ml: 1 }}
          >
            {overwrite ? 'Overwrite' : 'Save'}
          </Button>
        </Box>
        <Button
          size="large"
          variant="outlined"
          onClick={changeView}
          endIcon={!converting ? <VisibilityIcon /> : null}
          sx={{ ml: 12 }}
        >
          Switch to {show3D ? '2D-Editor' : '3D-Viewer'}
          {converting ? (
            <CircularProgress size="16px" color="inherit" sx={{ ml: 1 }} />
          ) : null}
        </Button>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button
          size="large"
          variant="contained"
          className="analyze-button"
          onClick={() =>
            navigate('/trained-models', {
              state: { selectedSmiles: selectedMolecule.smiles },
            })
          }
          disabled={!(selectedMolecule && selectedMolecule.smiles)}
          sx={{
            animation:
              help.helpMode && help.madeMolecule && !help.madeAnalysis
                ? `${pulseAnim} 2s infinite`
                : 'none',
          }}
        >
          Analyze {selectedMolecule ? selectedMolecule.name : ''}
        </Button>
      </CardActions>
    </Card>
  )
}

MoleculeView.propTypes = {
  selectedMolecule: PropTypes.object,
  onSave: PropTypes.func,
}
