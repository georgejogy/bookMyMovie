import {
  Button,
  FormControl,
  IconButton,
  Tabs,
  Tab,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import React from "react";
import "./Header.css";
import Logo from "../../assets/logo.svg";
import ReactModal from "react-modal";
import Close from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div {...other}>{value === index && <div p={3}>{children}</div>}</div>;
}

const Header = function (props) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [userName, setUserName] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [buttonLogin, setButtonLogin] = React.useState("LOGIN");
  const [signUp, setSignUp] = React.useState("");
  const [isUserLoggedIn, setUserLoggedIn] = React.useState(false);
  const [loginDetail, setLoginDetail] = React.useState("");
  const accessedDetailsPage = props.buttonRequest;
  const detailsID = props.getDetails;
  const [reqLoginUserName,setReqLoginUserName] = React.useState("dispNone");
  const [reqLoginPassword,setReqLoginPassword] = React.useState("dispNone");
  const [reqPhone,setReqPhone] = React.useState("dispNone");
  const [reqEmail,setReqEmail] = React.useState("dispNone");
  const [reqPassword,setReqPassword] = React.useState("dispNone");
  const [reqFirstName,setReqFirstName] = React.useState("dispNone");
  const [reqLastName,setReqLastName] = React.useState("dispNone");

  React.useEffect(() => {
    const loginInfo = window.sessionStorage.getItem("access-token");
    if (loginInfo) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, []);
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Login functionality
  async function login() {
    const param = window.btoa(`${userName}:${loginPassword}`);
    if (userName === "" || loginPassword === "") {
      userName ==="" ? setReqLoginUserName("dispBlock"):setReqLoginUserName("dispNone");
      loginPassword==="" ? setReqLoginPassword("dispBlock"):setReqLoginPassword("dispNone");
      setLoginDetail("Enter all the values");
    } else {
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
          setButtonLogin("LOGOUT");
          setIsOpen(false);
          setLoginDetail("");
          setUserLoggedIn(true);
          setUserName("");
          setLoginPassword("");
        } else {
          const error = new Error();
          error.message = result.message || "Something went wrong.";
          setLoginDetail("Incorrect username or password");
        }
      } catch (e) {
        alert(`Error: ${e.message}`);
        setLoginDetail("Incorrect username or password");
      }
    }
  }

  //Logout functionaility
  async function logout() {
    const param = window.sessionStorage.getItem("access-token");

    const rawResponse = await fetch(
      "http://localhost:8085/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          authorization: `Bearer ${param}`,
        },
      }
    );
    if (rawResponse.ok) {
      setButtonLogin("LOGIN");
      window.sessionStorage.clear();
      setUserLoggedIn(false);
    } else {
      setLoginDetail("Incorrect username or password");
    }
  }

  //Used to take care of sign up functionality. Validations for empty fields provided also taken care here.
  const handleSubmitSignup = async () => {
    const params = {
      email_address: email,
      first_name: firstName,
      last_name: lastName,
      mobile_number: phone,
      password: password,
    };
    if (
      email === "" ||
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      password === ""
    ) {
      email ==="" ? setReqEmail("dispBlock"):setReqEmail("dispNone");
      firstName === "" ? setReqFirstName("dispBlock"):setReqFirstName("dispNone")
      lastName === "" ? setReqLastName("dispBlock"):setReqLastName("dispNone")
      phone === "" ? setReqPhone("dispBlock"):setReqPhone("dispNone");
      password === "" ? setReqPassword("dispBlock") :setReqPassword("dispNone");
      setSignUp("Enter all the mandatory details !");
    } else {
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
          setSignUp("Registration Successfull. Please Login !");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setPhone("");
        })
        .catch((error) => {
          setSignUp("Registration not successful");
        });
    }
  };

  //Used to open the modal when clicking on login button
  const loginOrLogout = () => {
    if (!isUserLoggedIn) {
      setIsOpen(true);
      setButtonLogin("LOGIN");
    }
  };

  //Used to open the modal when the user is not logged in and when the user clicks on book show button
  const handleBookShow = () => {
    if (buttonLogin === "LOGIN") {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <div className="header">
        <img className="img-fluid" src={Logo} alt="logo" />

        {isUserLoggedIn ? (
          <Button variant="contained" className="buttonLogin" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            className="buttonLogin"
            onClick={loginOrLogout}
          >
            Login
          </Button>
        )}

        {accessedDetailsPage && isUserLoggedIn && (
          <Link to={`/bookshow/${detailsID}`}>
            <Button
              variant="contained"
              className="bookMyShow"
              color="primary"
              onClick={handleBookShow}
            >
              {props.buttonNeeded}
            </Button>
          </Link>
        )}
        {accessedDetailsPage && !isUserLoggedIn && (
          <Button
            onClick={loginOrLogout}
            variant="contained"
            color="primary"
            className="bookMyShow"
          >
            {props.buttonNeeded}
          </Button>
        )}
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
                  <FormHelperText className={reqLoginUserName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  
                  <TextField
                    label="LoginPassword"
                    variant="standard"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqLoginPassword}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  
                  <div className="error-details-login">{loginDetail}</div> 
                  <Button variant="contained" color="primary" onClick={login}>
                    LOGIN
                  </Button>
                  <br />
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
                  <FormHelperText className={reqFirstName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqLastName}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Email"
                    variant="standard"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqEmail}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Password"
                    variant="standard"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqPassword}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                  <TextField
                    label="Mobile"
                    variant="standard"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={true}
                  />
                  <FormHelperText className={reqPhone}>
                    <span className="red">Required</span>
                  </FormHelperText>
                  <br />
                 <div className="error-details-login">{signUp}</div> 
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitSignup}
                  >
                    SIGN UP
                  </Button>
                  <br />
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
