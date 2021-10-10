import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Tabs,
  Tab,
  TextField,
} from "@material-ui/core";
import React from "react";
import "./Header.css";
import Logo from "../../assets/logo.svg";
import ReactModal from "react-modal";
import Close from "@material-ui/icons/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <div p={3}>{children}</div>}</div>;
}

const Header = function (props) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loginContent, setLoginContent] = React.useState({
    login: "",
    password: "",
  });
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [loginState, setLoginState] = React.useState(false);
  const [userName,setUserName] = React.useState("");
  const [loginPassword,setLoginPassword] = React.useState("");
  const [buttonLogin,setButtonLogin] = React.useState("LOGIN");
  const [BookShow,setBookShow] = React.useState('');
  const [signUp,setSignUp]=React.useState('');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function login() {
    console.log(userName,loginPassword)
    const param = window.btoa(`${userName}:${loginPassword}`);
    try {
      const rawResponse = await fetch(
        "http://localhost:8085/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            authorization: `Basic ${param}`,
          },
        }
      );

      const result = await rawResponse.json();
      if (rawResponse.ok) {
        window.sessionStorage.setItem("user-details", JSON.stringify(result));
        window.sessionStorage.setItem(
          "access-token",
          rawResponse.headers.get("access-token")
        );
        //window.location.href = "./header.js";
        setLoginState(true);
        setButtonLogin('LOGOUT');
        setIsOpen(false);
      } else {
        const error = new Error();
        error.message = result.message || "Something went wrong.";
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  }

  const inputChangedHandler = (e) => {
    const state = loginContent;
    state[e.target.name] = e.target.value;
    setLoginContent({ ...state });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, password, phone);
  };

  const handleSubmitSignup = async () => {
    const params = {
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      mobile_number: phone,
      password: password,
    };
    console.log(params);
    fetch("http://localhost:8085/api/v1/signup", {
      body: JSON.stringify(params),
      method: "POST",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        response.json();
        setSignUp('Registration Successfull');
      })
      .catch((error) => {
        setSignUp('Registration not successful')
        console.log(error)});
  };

const loginOrLogout =()=>{
  if(buttonLogin=='LOGIN'){
    setIsOpen(true);
    setButtonLogin('LOGIN');
  }
  else{
    setButtonLogin('LOGOUT');
  }
}

  return (
    <div>
      <div className="header">
        <div>
          <img
            className="img-fluid rotate linear infinite"
            src={Logo}
            alt="logo"
          />
        </div>
        
        <Button variant="contained" className="buttonLogin" onClick={loginOrLogout}>
          {buttonLogin}
        </Button>
        {/* <Button variant="contained" className="buttonLogin" color="primary">
          {BookShow}
        </Button> */}
        <div className="modalStyling">
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Login Modal"
            ariaHideApp={false}
            className="custom-model-class"
          >
            <IconButton onClick={closeModal} className="closeButton">
              <Close></Close>
            </IconButton>
            <br />
            <br />
            <div className="tabAllignments">
              <Tabs value={value} onChange={handleChange}>
                <Tab className="tabAllignments" label="Login" />
                <Tab className="tabAllignments" label="Sign up" />
              </Tabs>

              <TabPanel value={value} index={0}>
                <FormControl className="forms">
                  <TextField
                    label="Username"
                    variant="standard"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required={true}
                  />
                  <br />
                  <br />
                  <TextField
                    label="LoginPassword"
                    variant="standard"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required={true}
                  />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={login}
                  >
                    LOGIN
                  </Button>
                </FormControl>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <FormControl className="forms">
                  <br />
                  <br />
                  <TextField
                    label="First Name"
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={true}
                    
                  />
                  <br />
                  <br />
                  <TextField
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={true}
                    
                  />
                  <br />
                  <br />
                  <TextField
                    label="Email"
                    variant="standard"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                  <br />
                  <br />
                  <TextField
                    label="Password"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                  <br />
                  <br />
                  <TextField
                    label="Mobile"
                    variant="standard"
                    value="Mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={true}
                    // helperText={mobileError ? "Error" : "Perfect!"}
                  />
                  <br />
                  <br />
                  <div>
                    {signUp}
                  </div>
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitSignup}
                >
                  SIGN UP
                </Button>
                </FormControl>
                
              </TabPanel>
              {/*  */}
            </div>
          </ReactModal>
        </div>
      </div>
    </div>
  );
};

export default Header;
