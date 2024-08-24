const { component, css, button } = require("boxwood")
const styles = css.load(__dirname)

module.exports = component(
  ({ px }) => {
    return button({
      className: [styles.button, px && styles[`px-${px}`]],
    })
  },
  { styles }
)
