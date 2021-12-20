import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

Icon.propTypes = {
  name: PropTypes.object.isRequired,
  size: PropTypes.string,
}

function Icon({ name, size, ...props }) {
  return (
    <span {...props}>
      <FontAwesomeIcon icon={name} size={size} />
    </span>
  )
}

export default Icon
