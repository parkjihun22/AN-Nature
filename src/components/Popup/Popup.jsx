import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCookies } from "react-cookie";
import { FaAngleRight } from "react-icons/fa6";

import styles from "./Popup.module.scss";

const COOKIE_NAME = "Braincity_Benefits_PC_20261027";

const Popup = ({
  popupImage,
  suspended = false,
  openInterestPopup = () => {},
}) => {
  const [isClick, setIsClick] = useState(false);

  const [cookies, setCookie] = useCookies([COOKIE_NAME]);
  const isPopupShown = Boolean(cookies[COOKIE_NAME]);

  // PC 팝업 표시 시간
  useEffect(() => {
    if (isPopupShown) return;

    const timer = setTimeout(() => {
      setIsClick(true);
    }, 300); // 300 = 0.3초

    return () => clearTimeout(timer);
  }, [isPopupShown]);

  useEffect(() => {
    if (!isClick || suspended || isPopupShown) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsClick(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isClick, suspended, isPopupShown]);

  const handleTodayClose = () => {
    const expires = new Date();

    // 당일 자정까지 숨김
    expires.setHours(24, 0, 0, 0);

    setCookie(COOKIE_NAME, true, {
      path: "/",
      expires,
      sameSite: "lax",
    });

    setIsClick(false);
  };

  const handleClose = () => {
    setIsClick(false);
  };

  const handleReservationClick = () => {
    setIsClick(false);
    openInterestPopup();
  };

  if (
    isPopupShown ||
    suspended ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <div
      className={styles.container}
      data-native-scroll-section="true"
    >
      {isClick ? (
        <section
          className={styles.popupBox}
          aria-label="브레인시티 앤네이처 미래도 특별혜택"
        >
          <div className={styles.imgContainer}>
            <img
              className={styles.popupImg}
              src={popupImage}
              alt="브레인시티 앤네이처 미래도 특별혜택. 2천만원 혜택, 계약금 입주까지 0원, 발코니 무상, 에어컨 3대 무상, 계약축하금. 적용 대상과 세부 조건은 계약 전 확인 바랍니다."
            />
          </div>

          <button
            type="button"
            className={styles.visitReservationBtn}
            onClick={handleReservationClick}
          >
            특별혜택 상담 · 방문예약
            <FaAngleRight
              size={16}
              aria-hidden="true"
            />
          </button>

          <div className={styles.btnContainer}>
            <button
              type="button"
              onClick={handleTodayClose}
            >
              오늘 하루 보지 않기
            </button>

            <button
              type="button"
              onClick={handleClose}
            >
              닫기
              <span
                className={styles.closeIcon}
                aria-hidden="true"
              >
                ×
              </span>
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          className={styles.openPopupBtn}
          onClick={() => setIsClick(true)}
          aria-label="특별혜택 팝업 다시 열기"
        >
          <FaAngleRight aria-hidden="true" />
          <span>특별혜택</span>
        </button>
      )}
    </div>,
    document.body
  );
};

export default Popup;