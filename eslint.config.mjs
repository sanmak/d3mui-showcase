import coreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...coreWebVitals,
  {
    rules: {
      // Mock data initialization in useEffect on mount is intentional
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
