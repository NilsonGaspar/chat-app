import React, { useState } from "react";
import "./Login.css";
import { auth, googleProvider } from "../Firebase";
import logoIcon from "../img/chat-app-logo.png";

function Login({ getUserData, isLoading }) {
  async function SignInWithGoogle() {
    let result = await auth.signInWithPopup(googleProvider);
    if (result) {
      getUserData(result.user);
    } else {
      alert("Login Error!");
    }
  }

  return (
    <>
      {!isLoading ? (
        <div className="login">
          <img className="logo" alt="" src={logoIcon} />
          <h1 className="title">Welcome to Messenger.</h1>
          <p className="description">Connect with your friends and family!</p>
          <button className="btnLogin" onClick={SignInWithGoogle}>
            Sign in With Google
          </button>
        </div>
      ) : (
        <div className="login">Loading</div>
      )}
    </>
  );
}

export default Login;
