import Modernizr from 'modernizr';

export default {
  'lockorientation': !!Modernizr.prefixed('lockOrientation', screen),
  'orientationlock': !!(screen.orientation && screen.orientation.lock),
};
