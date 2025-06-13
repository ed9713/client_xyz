import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/bootstrap.min.css";

import NoEnterPage from "./components/common/NoEnterPage";
import EmptyPage from "./components/common/EmptyPage";
import MainTest from "./pages/main/MainTest";
import Main from "./pages/main/Main";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import BcDetail from "./pages/bc/BcDetail";
import BcList from "./pages/bc/BcList";
import BcModify from "./pages/bc/BcModify";
import BcRegister from "./pages/bc/BcRegister";

import UserLogin from "./pages/user/UserLogin";
import UserList from "./pages/user/UserList";
import UserModify from "./pages/user/UserModify";
import UserRegister from "./pages/user/UserRegister";
import PwChange from "./pages/user/PwChange";

import CdList from "./pages/cm/CdList";
// import CdDeatil from './pages/cm/CdDetail'
import CdRegister from "./pages/cm/CdRegister";
import CdModify from "./pages/cm/CdModify";

import PeopleListList from "./pages/cm/PeopleList";

import ConnerList from "./pages/bc/ConnerList";

import cookie from "react-cookies";
import Login from "./pages/login";
import axios from "axios";


import { CmUserContext } from "./context/CmUserContext";
import {
  CM_LOGIN_NOT_CHECK,
  CM_LOGIN_NOT_EMAIL,
  CM_USER_EMAIL_ADM,
  CmRemoveCookie,
  URL_USER_LOGIN,
} from "./components/js/Common";

function App() {
  const [ctxtCmUser, setCtxtCmUser] = useState({
    userEmail: CM_LOGIN_NOT_CHECK,
  });

  const [setGOpenYn] = useState("Y");

  // ================================================================
  useEffect(() => {
    getCtxtCmUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 정보 가져오기
  const getCtxtCmUser = () => {
    const nowPathName = window.location.pathname;

    if (
      nowPathName.indexOf("/PwChangeForm") === -1 &&
      nowPathName.indexOf("/blank") === -1
    ) {
      axios
        .post("/api/cm/loginForm?type=SessionConfirm", {
          token1: cookie.load("userEmail"),
          token2: cookie.load("userNickName"),
        })
        .then((response) => {
          // this.state.userEmail = response.data.token1
          try {
            const userEmail = response.data.json[0].token1;
            const openYn = response.data.json[0].openYn;
            if (openYn === "N") {
              setGOpenYn("N");
              console.log(openYn);
            }

            if (
              openYn === "N" &&
              window.location.pathname.indexOf(URL_USER_LOGIN) === -1 &&
              userEmail !== CM_USER_EMAIL_ADM
            ) {
              console.log("닫기");
              siteClose();
              return;
            }

            let password = cookie.load("userPassword");
            let ip = cookie.load("userIp");
            if (password !== undefined) {
              axios
                .post("/api/cm/loginForm?type=SessionSignin", {
                  is_Email: userEmail,
                  is_Token: password,
                  is_Token2: ip,
                })
                .then((response) => {
                  if (response.data.json[0].userNickName === undefined) {
                    noPermission();
                  } else {
                    // console.log(response.data.json[0])
                    setCtxtCmUser(response.data.json[0]);
                  }
                })
                .catch(() => {
                  noPermission();
                });
            } else {
              noPermission();
            }
          } catch (error) {
            console.log(error);
            noPermission();
          }
        })
        .catch(() => noPermission());
    }
  };

  // 로그인 정보 체크 후 로그인 페이지로 이동
  const noPermission = () => {
    setCtxtCmUser({ userEmail: CM_LOGIN_NOT_EMAIL });
    if (window.location.hash !== "nocookie") {
      // remove_cookie();
      CmRemoveCookie();
      // window.location.href = '/user/login/#nocookie';
    }
  };

  // 사이트 닫기인 경우 페이지로 이동
  const siteClose = () => {
    window.location.href = "/blank";
  };

  
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <CmUserContext.Provider value={{ ctxtCmUser, setCtxtCmUser }}>
          <Header />
          <Switch>
            <Route exact path="/main" component={MainTest} />
            <Route exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />

            <Route exact path="/user/login" component={UserLogin} />
            <Route exact path="/user/register" component={UserRegister} />
            <Route path="/PwChange/:email/:token" component={PwChange} />

            <Route exact path="/user/myInfo" component={UserModify} />
            <Route exact path="/user/modify/:userSeq" component={UserModify} />
            <Route exact path="/user/list" component={UserList} />
            <Route exact path="/user/list/:nowPage" component={UserList} />

            <Route exact path="/bc/list" component={BcList} />
            <Route exact path="/bc/list/:nowPage" component={BcList} />
            <Route exact path="/bc/register" component={BcRegister} />
            <Route exact path="/bc/modify/:broadcastSeq" component={BcModify} />
            <Route exact path="/bc/detail/:broadcastSeq" component={BcDetail} />

            <Route exact path="/conner/list" component={ConnerList} />
            <Route exact path="/conner/list/:nowPage" component={ConnerList} />

            <Route exact path="/cm/cd/list" component={CdList} />
            <Route exact path="/cm/cd/list/:nowPage" component={CdList} />
            <Route exact path="/cm/cd/register" component={CdRegister} />
            <Route path="/cm/cd/modify/:cdSeq/:cdId" component={CdModify} />

            <Route exact path="/cm/people/list" component={PeopleListList} />
            <Route
              exact
              path="/cm/people/list/:nowPage"
              component={PeopleListList}
            />
            <Route exact path="/blank" component={NoEnterPage} />
            <Route>
              <EmptyPage name="" />
            </Route>
          </Switch>
          <Footer name="우리나라" />
        </CmUserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
