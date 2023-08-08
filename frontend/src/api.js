import axios from 'axios'
import io from 'socket.io-client'

// Localhost by default
const defaultAddress = '127.0.0.1'
const defaultPort = '5000'

let serverAddress = defaultAddress
let serverPort = defaultPort

// Create http API and socket instance
const api = axios.create({ baseURL: `http://${serverAddress}:${serverPort}` })
let socket = io(`ws://${serverAddress}:${serverPort}`, { timeout: 60000 })

let userID = ''

// Add a response interceptor for "not logged in" states
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.status === 401) {
      // Navigate to start page
      alert('You have been logged out due to inactivity.')
      window.location.href = '/'
      return undefined
    }
    console.log(error)
    return Promise.reject(error)
  }
)

/**
 * Updates the base URL for axios & address for socketio.
 * Creates a new socket with the new address and transfers all callbacks.
 */
function updateBaseURL() {
  api.defaults.baseURL = `http://${serverAddress}:${serverPort}`
  const newSocket = io(`ws://${serverAddress}:${serverPort}`, {
    timeout: 60000,
  })
  Object.keys(socket._callbacks).forEach((key) => {
    const eventName = key.replace('$', '')
    socket.listeners(eventName).forEach((func) => {
      newSocket.on(eventName, func)
    })
  })
  socket.disconnect()
  socket = newSocket
}

// Accessible frontend API functions
export default {
  /**
   * @returns {boolean} Status of the socket connection
   */
  getConnectionStatus() {
    return socket.connected
  },

  /**
   * @returns {string} Current server IP address
   */
  getServerAddress() {
    return serverAddress
  },

  /**
   * @returns {string} Current server port
   */
  getServerPort() {
    return serverPort
  },

  /**
   * @returns {string} Default server IP address
   */
  getDefaultAddress() {
    return defaultAddress
  },

  /**
   * @returns {string} Default server port
   */
  getDefaultPort() {
    return defaultPort
  },

  /**
   * Sets the server IP address and reconnects socket & axios
   * @param address {string} New server IP address
   */
  setServerAddress(address) {
    serverAddress = address
    updateBaseURL()
  },

  /**
   * Sets the server port and reconnects socket & axios
   * @param port {string} New server port
   */
  setServerPort(port) {
    serverPort = port
    updateBaseURL()
  },

  /**
   * Requests scoreboard data from backend
   * @returns {Promise<AxiosResponse<*[]> | *[]>} Promise that returns the scoreboard list (response data) without exception handling
   */
  async getModelScoreboard(datasetId, labels) {
    return api
      .get(`/mod-scoreboard/${datasetId}/${labels}`)
      .then((response) => {
        return response.data
      })
      .catch(() => [])
  },

  /**
   * Request the deletion of a specific model scoreboard entry
   * @param fittingID {string} ID of the fitting to be deleted
   * @returns {Promise<null>} Promise that returns nothing, but catches exceptions
   */
  async deleteScoreboardFitting(fittingID) {
    return api
      .delete(`/mod-scoreboard/${fittingID}`)
      .then(() => {})
      .catch(() => {})
  },

  /**
   * Requests the deletion of all scoreboard entries
   * @returns {Promise<null>} Promise that returns nothing, but catches exceptions
   */
  async deleteScoreboardFittings() {
    return api
      .delete('/mod-scoreboard')
      .then(() => {})
      .catch(() => {})
  },

  /**
   * Requests molecule scoreboard data from backend
   * @param label {string} Analyzed molecule characteristic
   * @returns {Promise<AxiosResponse<*[]> | *[]>} Promise that returns the scoreboard list (response data) without exception handling
   */
  async getMoleculeScoreboard(label) {
    return api
      .get(`/mol-scoreboard/${label}`)
      .then((response) => {
        return response.data
      })
      .catch(() => [])
  },

  /**
   * Request the deletion of a specific molecule scoreboard entry
   * @param fittingID {string} ID of the fitting to be deleted
   * @param moleculeName {string} Name of the molecule to be deleted
   * @returns {Promise<null>} Promise that returns nothing, but catches exceptions
   */
  async deleteScoreboardMolecule(fittingID, moleculeName) {
    return api
      .delete(`/mol-scoreboard/${fittingID}/${moleculeName}`)
      .then(() => {})
      .catch(() => {})
  },

  /**
   * Requests the deletion of all molecule scoreboard entries
   * @returns {Promise<null>} Promise that returns nothing, but catches exceptions
   */
  async deleteScoreboardMolecules() {
    return api
      .delete('/mol-scoreboard')
      .then(() => {})
      .catch(() => {})
  },

  /**
   * Requests the model list for the current user
   * @returns {Promise<AxiosResponse<*[]> | *[]>} Promise that returns the model list, or an empty array on exception
   */
  async getModelList() {
    return api
      .get(`/users/${userID}/models`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests the molecule list for the current user
   * @returns {Promise<AxiosResponse<*[]> | *[]>} Promise that returns the molecule list or an empty array on exception
   */
  async getMoleculeList() {
    return api
      .get(`/users/${userID}/molecules`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests the fitting list for the current user
   * @returns {Promise<AxiosResponse<*[]> | []>} Promise that returns the fitting list or an empty array on exception
   */
  async getFittings() {
    return api
      .get(`/users/${userID}/fittings`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests the dataset summary list
   * @returns {Promise<AxiosResponse<*[]> | []>} Promise that returns the dataset summary list or an empty array on exception
   */
  async getDatasets() {
    return api
      .get(`/datasets`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests histograms for a specific dataset
   * @param datasetID {string} ID of the dataset
   * @param labels {string[]} List of labels to be included in the histogram
   * @returns {Promise<AxiosResponse<*[]>, []>} Promise that returns an array containing the histogram data or an empty array on exception
   */
  async getHistograms(datasetID, labels) {
    return api
      .get(`/histograms/${datasetID}/${labels}`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests list of base models from server
   * @returns {Promise<AxiosResponse<*[]> | []>} Promise that returns the base model list or an empty array on exception
   */
  async getBaseModels() {
    return api
      .get(`/baseModels`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return []
      })
  },

  /**
   * Requests to add a model for the current user
   * @param config {ModelConfig} Model configuration
   * @returns {Promise<AxiosResponse<string> | null>} Promise that returns the model ID or null
   */
  async addModelConfig(config) {
    return api
      .patch(`/users/${userID}/models`, config)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return null
      })
  },

  /**
   * Requests proper 3D coordinates for a specific SMILES string
   * @param smiles {Variant} SMILES string of the molecule
   * @returns {Promise<AxiosResponse<string> | null>} Promise that returns the 3D molecule cml string or null on exception
   */
  async get3DMolecule(smiles) {
    return api
      .get(`/molecule/${encodeURIComponent(btoa(smiles))}`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return null
      })
  },

  /**
   * Requests to add a molecule for the current user
   * @param smiles {string} SMILES string of the molecule
   * @param cml {string} CML string of the molecule
   * @param name {string} Name of the molecule
   * @returns {Promise<AxiosResponse<null>>} Promise that returns the server response data (null)
   * @throws Error if the molecule couldn't be added
   */
  async addMolecule(smiles, cml, name) {
    return api
      .patch(`/users/${userID}/molecules`, {
        smiles,
        cml,
        name,
      })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        throw Error("Couldn't add molecule")
      })
  },

  /**
   * Requests a user login
   * @param username Name of the new user
   * @returns {Promise<AxiosResponse<string>>} Promise that returns the userID
   * @throws Error if the login failed
   */
  async login(username) {
    return api
      .post(`/users`, { username, socketID: socket.io.engine.id })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        throw Error('Login failed')
      })
  },

  /**
   * Executes a login request and sets the userID
   * @param username Name of the new user
   * @returns {Promise<boolean>} Promise that returns true if the login was successful and false if not
   */
  async completeLogin(username) {
    return this.login(username)
      .then((r) => {
        userID = r.userID
        socket.emit('login', userID)
        return true
      })
      .catch(() => {
        return false
      })
  },

  /**
   * Requests a user logout
   * Resets the userID
   * @returns {Promise<AxiosResponse<null> | null>} Promise that returns the server response (null) or null on exception
   */
  async logout() {
    return api
      .delete(`/users/${userID}`)
      .then((response) => {
        userID = ''
        return response.data
      })
      .catch(() => {
        return null
      })
  },

  /**
   * Requests server to analyze a molecule with a specific fitting
   * @param fittingID {string} ID of the fitting
   * @param smiles {string} SMILES string of the molecule
   * @returns {Promise<AxiosResponse<any> | null>} Promise that returns the analysis results {Object} without exception handling
   */
  async analyzeMolecule(fittingID, smiles) {
    return api
      .post(`/users/${userID}/analyze`, { fittingID, smiles })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return null
      })
  },

  /**
   * Train referenced model with given dataset on given labels for given epochs with given batch size
   * @param datasetID {string} ID of dataset to train on
   * @param modelID {string} ID of model to train
   * @param labels {array} List of labels to train on
   * @param epochs {number} Number of epochs to train for
   * @param batchSize {number} Batch size to train with
   * @returns {Promise<AxiosResponse<boolean> | boolean>} Promise of a boolean indicating whether starting the training was successful
   */
  async trainModel(datasetID, modelID, labels, epochs, batchSize) {
    return api
      .post(`/users/${userID}/train`, {
        datasetID,
        modelID,
        labels: JSON.stringify(labels),
        epochs,
        batchSize,
      })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return false
      })
  },

  /**
   * Continues the training of referenced fitting for the specified number of epochs
   * @param fittingID {string} ID of fitting to continue training
   * @param epochs {number} Number of epochs to train for
   * @returns {Promise<AxiosResponse<number> | number>} Promise returning a number indicating the number of epochs to be trained, 0 when failed
   */
  async continueTraining(fittingID, epochs) {
    return api
      .patch(`/users/${userID}/train`, { fittingID, epochs })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error?.response?.data || 0
      })
  },

  /**
   * Stops the currently running training
   * @returns {Promise<AxiosResponse<boolean>>} Promise returning a Boolean indicating whether the training was stopped
   */
  async stopTraining() {
    return api
      .delete(`users/${userID}/train`)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return false
      })
  },

  /**
   * Registers a callback function to be called when the socket emits the given event.
   * @param action {string} The event name
   * @param onAction {function} The callback function
   * @returns {Socket<DefaultEventsMap, ListenEvents>} void
   */
  registerSocketListener(action, onAction) {
    return socket.on(action, (res) => {
      if (res[userID]) {
        onAction(res[userID])
      }
    })
  },
}
