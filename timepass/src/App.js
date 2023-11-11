import {Component} from 'react'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber} from './firebase'


class App extends Component {

  state={mobileNumber:"", otp:""}

  handleMobileNumber = (e) => {
      this.setState({mobileNumber:e.target.value})
  }

  handleOtpNumber = (e)=>{
    this.setState({otp:e.target.value})
  }

  configureCaptcha = () =>{
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
       // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.onSignInSubmit();
        console.log("Recaptca varified")
      }
    });
  } 


  onSignInSubmit = (e) => {
    e.preventDefault()
    this.configureCaptcha()

    const phoneNumber = "+91" + this.state.mobileNumber
    const appVerifier = window.recaptchaVerifier;
    
    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          // ...
          console.log("OTP has been sent")
        }).catch((error) => {
          // Error; SMS not sent
          // ...
          console.log("SMS not sent")
        });

  }


  onSubmitOTP = (e) =>{
    e.preventDefault()
    const code = this.state.otp
    console.log(code)
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log(JSON.stringify(user))
      alert("User is verified")
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      console.log("Invalid Otp")
      alert("Invalid otp")
    });
  }


  render() {
    return (
      <div>
        <h2>Login Form</h2>
        <form onSubmit={this.onSignInSubmit}>
          <div id="sign-in-button"></div>
          <input type="number" name="mobile" placeholder="Mobile number" onChange={this.handleMobileNumber}/>
          <button type="submit">Submit</button>
        </form>

        <h2>Enter OTP</h2>
        <form onSubmit={this.onSubmitOTP}>
          <input type="number" name="otp" placeholder="OTP Number" onChange={this.handleOtpNumber}/>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}
export default App