import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import cookie from "react-cookies";
import {
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { CmUserContext } from "../../context/CmUserContext";
import {
  CM_LOGIN_NOT_CHECK,
  CM_MIN_WIDTH_DEFAULT,
  CM_USER_LEVEL_ADM,
  CmRemoveCookie,
  URL_BC_LIST,
  URL_BC_REGISTER,
  URL_CD_LIST,
  URL_CONNER_LIST,
  URL_PEOPLE_LIST,
  URL_USER_LOGIN,
} from "../js/Common";
import CmIsMobile from "../../hook/CmIsMobile";

export default function Header() {
  // 메뉴 관련
  // const [collapsed, setCollapsed] = useState(true);
  // const [dropdownOpenMenu, setDropdownOpenMenu] = useState(false);

  const [dropdownOpenUser, setDropdownOpenUser] = useState(false);
  const toggleUser = () => setDropdownOpenUser(!dropdownOpenUser);

  const [dropdownOpenAdmin, setDropdownOpenAdmin] = useState(false);
  const toggleAdmin = () => setDropdownOpenAdmin(!dropdownOpenAdmin);

  const [dropdownOpenList, setDropdownOpenList] = useState(false);
  const toggleList = () => setDropdownOpenList(!dropdownOpenList);

  //========================================================================
  // 로그인 정보
  const { ctxtCmUser } = useContext(CmUserContext);
  let myCtxtCmUser = { ...ctxtCmUser };

  if (!myCtxtCmUser || !myCtxtCmUser.userEmail) {
    myCtxtCmUser = {};
    myCtxtCmUser.userEmail = CM_LOGIN_NOT_CHECK;
  }
  
  //========================================================================
  // 현재 화면 타이틀
  const location = useLocation();
  const locationList = [
    { url: "/", title: "" },
    { url: URL_USER_LOGIN, title: "로그인" },
    { url: "/user/register", title: "회원등록" },
    { url: "/user/modify", title: "회원수정" },
    { url: "/user/myInfo", title: "내정보수정" },
    { url: "/user/list", title: "회원목록" },
    { url: "/PwChange", title: "비밀번호재설정" },

    { url: "/conner/list", title: "코너목록" },
    { url: "/guest/list", title: "게스트목록" },

    { url: URL_BC_LIST, title: "방송목록" },
    { url: "/bc/detail", title: "방송상세" },
    { url: "/bc/register", title: "방송등록" },
    { url: "/bc/modify", title: "방송수정" },

    { url: URL_CD_LIST, title: "코드목록" },
    { url: "/cm/cd/detail", title: "코드상세" },
    { url: "/cm/cd/register", title: "코드등록" },
    { url: "/cm/cd/modify", title: "코드수정" },

    { url: URL_PEOPLE_LIST, title: "참여자목록" },
  ];

  let pathName = location.pathname;
  if (pathName.indexOf("/cm/cd/modify/") === 0) {
    pathName = "/cm/cd/modify";
  } else if (pathName.indexOf("/cm/cd/list/") === 0) {
    pathName = "/cm/cd/list";
  } else if (pathName.indexOf("/bc/modify/") === 0) {
    pathName = "/bc/modify";
  } else if (pathName.indexOf("/bc/detail/") === 0) {
    pathName = "/bc/detail";
  } else if (pathName.indexOf(URL_BC_LIST + "/") === 0) {
    pathName = URL_BC_LIST;
  } else if (pathName.indexOf(URL_PEOPLE_LIST + "/") === 0) {
    pathName = URL_PEOPLE_LIST;
  } else if (pathName.indexOf("/conner/list/") === 0) {
    pathName = "/conner/list";
  } else if (pathName.indexOf("/guest/list/") === 0) {
    pathName = "/guest/list";
  } else if (pathName.indexOf("/user/modify/") === 0) {
    pathName = "/user/modify";
  }
  const nowLocation = locationList.find((item) => {
    return item.url === pathName;
  });

  //========================================================================
  // 로그인 정보 관련
  const [loginYn, setLoginYn] = useState("N");
  const [usernmState, setUsernmState] = useState();
  // const [userPowerState, setUserPowerState] = useState(true); // 관리자 권한

  //========================================================================
  useEffect(() => {
    var cookie_userid = cookie.load("userEmail");
    var cookie_usernm = cookie.load("userNickName");
    var cookie_password = cookie.load("userPassword");

    if (cookie_userid !== undefined) {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60);

      cookie.save("userEmail", cookie_userid, { path: "/", expires });
      cookie.save("userNickName", cookie_usernm, { path: "/", expires });
      cookie.save("userPassword", cookie_password, { path: "/", expires });

      if (ctxtCmUser) {
        if (ctxtCmUser.userNickName) {
          setLoginYn("Y");
          setUsernmState(ctxtCmUser.userNickName);
        }
      }
    } else {
      // console.log(`cookie_userid undefinedXXXXX `)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxtCmUser]);

  const logout = async () => {
    setLoginYn("N");
    CmRemoveCookie();
    window.location.href = "/";
  };

  const gotoUrl = (pUrl) => {
    if (pUrl) {
      window.location.href = pUrl;
      // console.log(`pUrl`)
      // history.push(pUrl);
    }
  };

  const navLinkActiveBc =
    pathName.indexOf("/bc/") === 0 ? { active: true } : {};
  const navLinkActiveConner =
    pathName.indexOf("/conner/") === 0 ? { active: true } : {};
  const navLinkActivePeople =
    pathName.indexOf("/cm/people/") === 0 ? { active: true } : {};
  const navLinkActiveMain =
    pathName.indexOf("/bc/") !== 0 &&
    pathName.indexOf("/conner/") !== 0 &&
    pathName.indexOf("/cm/people/") !== 0
      ? { active: true }
      : {};

  const isTab = window.innerWidth < CM_MIN_WIDTH_DEFAULT ? {} : { tabs: true };
  // const isTab = {tabs:true}

  const isMobile = CmIsMobile();
  // console.log(isMobile);

  return (
    <>
      <header>
        <div>
          <Nav {...isTab}>
            <NavItem>
              <NavLink href="/" {...navLinkActiveMain}>
                ⌂
              </NavLink>
            </NavItem>

            {isMobile ? (
              <>
                <Dropdown nav isOpen={dropdownOpenList} toggle={toggleList}>
                  <DropdownToggle nav caret>
                    목록
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => gotoUrl(URL_PEOPLE_LIST)}>
                      참여자
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => gotoUrl(URL_CONNER_LIST)}>
                      코너
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => gotoUrl(URL_BC_LIST)}>
                      채널
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink
                    {...navLinkActivePeople}
                    onClick={() => {
                      gotoUrl("/cm/people/list");
                    }}
                    className="cursorPointer"
                  >
                    참여자
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    {...navLinkActiveConner}
                    onClick={() => {
                      gotoUrl("/conner/list");
                    }}
                    className="cursorPointer"
                  >
                    코너
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    {...navLinkActiveBc}
                    onClick={() => {
                      gotoUrl(URL_BC_LIST);
                    }}
                    className="cursorPointer"
                  >
                    방송
                  </NavLink>
                </NavItem>
              </>
            )}

            {loginYn !== "Y" && ctxtCmUser.userEmail !== CM_LOGIN_NOT_CHECK ? (
              <>
                <Dropdown nav isOpen={dropdownOpenUser} toggle={toggleUser}>
                  <DropdownToggle nav caret>
                    회원
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        gotoUrl(URL_USER_LOGIN);
                      }}
                      className="cursorPointer"
                    >
                      로그인
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => gotoUrl("/user/register")}>
                      등록
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              ""
            )}

            {loginYn === "Y" ? (
              <>
                <NavItem hidden>
                  <NavLink href="#" onClick={logout}>
                    로그아웃
                  </NavLink>
                </NavItem>
                <Dropdown nav isOpen={dropdownOpenUser} toggle={toggleUser}>
                  <DropdownToggle nav caret>
                    [{usernmState}]님
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        gotoUrl("/user/myInfo");
                      }}
                    >
                      내정보수정
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => {
                        gotoUrl(URL_BC_REGISTER);
                      }}
                    >
                      방송등록
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => logout()}>
                      로그아웃
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            ) : (
              ""
            )}

            {ctxtCmUser.userLevel >= CM_USER_LEVEL_ADM ? (
              <Dropdown
                nav
                isOpen={dropdownOpenAdmin}
                toggle={toggleAdmin}               
              >
                <DropdownToggle nav caret>
                  관리자
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      gotoUrl(URL_BC_LIST);
                    }}
                  >
                    방송리스트
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      gotoUrl("/bc/register");
                    }}
                  >
                    방송등록
                  </DropdownItem>
                  <DropdownItem divider />

                  <DropdownItem
                    onClick={() => {
                      gotoUrl("/user/list");
                    }}
                  >
                    회원리스트
                  </DropdownItem>
                  <DropdownItem divider />

                  <DropdownItem
                    onClick={() => {
                      gotoUrl("/cm/cd/list");
                    }}
                  >
                    코드리스트
                  </DropdownItem>
                  {loginYn === "Y" ? (
                    <DropdownItem
                      onClick={() => {
                        gotoUrl("/cm/cd/register");
                      }}
                    >
                      코드등록
                    </DropdownItem>
                  ) : (
                    ""
                  )}
                </DropdownMenu>
              </Dropdown>
            ) : (
              ""
            )}
          </Nav>
        </div>
      </header>

      <nav>
        <div>
          {nowLocation && nowLocation.title ? `[${nowLocation.title}]` : ""}
        </div>
      </nav>
    </>
  );
}
