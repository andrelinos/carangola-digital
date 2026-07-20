import { getPaginatedProperties } from './src/actions/properties/get-paginated-properties'

getPaginatedProperties(null, null)
  .then(r => console.log(r.properties.length, 'properties found'))
  .catch(console.error)
