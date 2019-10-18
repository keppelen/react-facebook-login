import FacebookLogin from '../src/facebook'
import FacebookLoginWithButton from '../src/facebook-with-button'
import React from 'react'
import ReactDOM from 'react-dom'

const responseFacebook = response => {
  console.log(response)
}

const Base = () => {
  return (
    <div>
      <div>
        <p>Facebook login with default button and styling</p>
        <FacebookLoginWithButton
          appId='477947742822152'
          autoLoad={false}
          fields='name,email,picture'
          onClick={() => console.log('component clicked')}
          callback={responseFacebook}
          icon='fa-facebook'
        />
      </div>

      <div>
        <p>
          Facebook login with render prop (and no styling provided out the box)
        </p>
        <FacebookLogin
          appId='477947742822152'
          autoLoad={false}
          callback={responseFacebook}
          render={renderProps => (
            <button onClick={renderProps.onClick}>
              This is my custom FB button
            </button>
          )}
        />
      </div>
    </div>
  )
}

ReactDOM.render(<Base />, document.getElementById('demo'))
