import React from 'react'
import api from '../api'
import BaseModelsPage from './BaseModelsPage'
import ModelConfigPage from './ModelConfigPage'
import ModelsPage from './ModelsPage'
import UserContext from '../context/UserContext'
import TrainingContext from '../context/TrainingContext'
import { Route, Routes } from 'react-router-dom'
import PropTypes from 'prop-types'

/**
 * Handles model creation process
 * routes to appropriate pages and manages model list
 * @param initSelectedIndex initially selected index when navigating to ModelsPage
 * @returns {JSX.Element}
 * @constructor
 */
export default function ModelCreationRouter({ initSelectedIndex }) {
  const [modelList, setModelList] = React.useState([])
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)

  React.useEffect(() => {
    refreshModels()
  }, [user, training.trainingStatus])

  function refreshModels() {
    api.getModelList().then((models) => setModelList(models))
  }

  function deleteModel(index) {
    api.deleteModelConfig(modelList[index].id).then(refreshModels)
  }

  function deleteFitting(fittingID) {
    api.deleteFitting(fittingID).then(refreshModels)
  }

  function saveModel(model) {
    // Find a duplicate
    const duplicate = modelList.find((savedModel) => {
      return model.name === savedModel.name
    })

    if (duplicate) {
      return 'duplicate'
    } else if (!model) {
      return 'error'
    } else {
      api.addModelConfig(model).then(refreshModels)
      return 0
    }
  }

  return (
    <Routes>
      <Route
        path=""
        element={
          <ModelsPage
            modelList={modelList}
            initSelectedIndex={initSelectedIndex}
            deleteModel={deleteModel}
            deleteFitting={deleteFitting}
          />
        }
      />
      <Route path="base-models" element={<BaseModelsPage />} />
      <Route
        path="model-config"
        element={<ModelConfigPage addFunc={saveModel} />}
      />
    </Routes>
  )
}

ModelCreationRouter.propTypes = {
  initSelectedIndex: PropTypes.number,
}
