const { component, css, Button } = require("boxwood")
const styles = css.load(__dirname)

module.exports = component(
  ({ px }) => {
    return Button({
      className: [styles.button, px && styles[`px-${px}`]],
    })
  },
  { styles }
)
