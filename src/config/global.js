import logoLight from "assets/images/logo-white.svg"
import logoDark from "assets/images/logo.dark.svg"

window.appName = process.env.REACT_APP_NAME
window.logoLight = logoLight
window.logoDark = logoDark
// window.logoColor = logoColor
// window.defaultDP = defaultDP

window.getRandomId = () => Math.random().toString(36).slice(2)
