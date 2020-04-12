const path = require('path')

module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    rootDir: path.join(__dirname, '.'),
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
}