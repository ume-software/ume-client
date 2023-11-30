export default function getWindowDimensions() {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  return {
    windowWidth,
    windowHeight,
  }
}
