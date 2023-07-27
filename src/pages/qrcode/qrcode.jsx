import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthService from "../../services/AuthService";
import TokenService from "../../services/TokenService";
import { useNavigate } from "react-router-dom";
import vektor5 from "../../assets/images/Login/Vector5.png";
import vektor6 from "../../assets/images/Login/Vector6.png";
import vektor7 from "../../assets/images/Login/Vector7.png";
const QrCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const qrCode = location.state?.qrCode;
  const [code, setCode] = useState({
    twoFactoryKey: "",
    token: localStorage.getItem("token") || "",
  });

  const handleTwoFactoryChange = (e) => {
    setCode({ ...code, twoFactoryKey: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!code.twoFactoryKey) {
      setError("Lütfen tüm alanları doldurunuz.");
      return;
    }

    if (code.twoFactoryKey.length !== 6) {
      setError("2FA Kodunuz 6 haneli olmalıdır.");
      return;
    }

    AuthService.verifyCode(code)
      .then((response) => {
        if (response.data === true) {
          const decodedToken = TokenService.decodeToken(code.token);
          if (decodedToken && decodedToken.role === "ADMIN") {
            navigate("/adminhome");
          }
        } else {
          alert("hata var");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
      });
  };

  return (
    <div className="main">
      <div className="content-code w-2/6">
        <img className="vektor5" src={vektor5} alt="vektor5" />
        <img className="vektor6" src={vektor6} alt="vektor6" />
        <img className="vektor7" src={vektor7} alt="vektor7" />
        <div className="flex flex-col gap-10 w-4/5 justify-center items-center p-10">
          <div className="flex items-start justify-start w-full pb-5">
            <div id="email" className="font-bold text-2xl">
              2FA QR CODE
            </div>
          </div>
          <img className="w-1/2 " src={qrCode} alt="" />
          <input
            type="text"
            className="placeholder-input"
            onChange={handleTwoFactoryChange}
          />
          {error && <p>{error}</p>}
          <div className="cbottom">
            <button className="button" onClick={handleSubmit}>
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCode;
