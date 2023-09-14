import logoLight from "assets/images/logo2.png"
import logoDark from "assets/images/logo.png"
import image404light from "assets/images/404-light.svg"
import image404dark from "assets/images/404-dark.svg"

window.appName = process.env.REACT_APP_NAME
window.logoLight = logoLight
window.logoDark = logoDark
window.image404Dark = image404dark
window.image404Light = image404light

// window.logoColor = logoColor
// window.defaultDP = defaultDP

window.getRandomId = () => Math.random().toString(36).slice(2)
window.year = new Date().getFullYear()
