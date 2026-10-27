import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCookies } from "react-cookie";

import styles from "./MobilePopup.module.scss";

const MobilePopup = ({
  onClosed,
  popupImage,
  numbering,
  openInterestPopup = () => {},
}) => {
  const cookieName = `Popup_Cookie${numbering}`;

  const [cookies, setCookie] = useCookies([cookieName]);
  const isPopupShown = Boolean(cookies[cookieName]);

  const contentRef = useRef(null);

  useEffect(() => {
    if (isPopupShown) {
      onClosed(false);
    }
  }, [isPopupShown, onClosed]);

  // 배경 스크롤 잠금 / 키보드 포커스 관리
  useEffect(() => {
    if (isPopupShown) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";
    contentRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClosed(false);
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = contentRef.current?.querySelectorAll(
        'button:not([disabled]), [tabindex="0"]'
      );

      if (!nodes?.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (
        event.shiftKey &&
        (
          document.activeElement === first ||
          document.activeElement === contentRef.current
        )
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (previousFocus?.isConnected) {
        previousFocus.focus?.();
      }
    };
  }, [isPopupShown, onClosed]);

  const handleTodayClose = () => {
    const expires = new Date();

    // 당일 자정까지 숨김
    expires.setHours(24, 0, 0, 0);

    setCookie(cookieName, true, {
      path: "/",
      expires,
      sameSite: "lax",
    });

    onClosed(false);
  };

  const handleClose = () => {
    onClosed(false);
  };

  const handleReservationClick = () => {
    onClosed(false);
    openInterestPopup();
  };

  if (
    isPopupShown ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <div className={styles.backgroundContainer}>
      <section
        className={styles.contentContainer}
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label="브레인시티 앤네이처 미래도 특별혜택 안내"
        tabIndex={-1}
      >
        <div className={styles.popupHeader}>
          <span className={styles.headerTitle}>
            앤네이처 미래도 특별혜택
          </span>

          <button
            type="button"
            className={styles.topCloseBtn}
            onClick={handleClose}
            aria-label="특별혜택 팝업 닫기"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          className={styles.popupImageBox}
          tabIndex={0}
          aria-label="혜택 안내 이미지. 위아래로 스크롤하여 전체 내용을 확인하세요."
        >
          <img
            className={styles.popupImg}
            src={popupImage}
            alt="브레인시티 앤네이처 미래도 특별혜택. 2천만원 혜택, 계약금 입주까지 0원, 발코니 무상, 에어컨 3대 무상, 계약축하금. 적용 대상과 세부 조건은 계약 전 확인 바랍니다."
          />
        </div>

        <div className={styles.actionContainer}>
          <button
            type="button"
            className={styles.visitReservationBtn}
            onClick={handleReservationClick}
          >
            <span className={styles.reservationText}>
              <span className={styles.reservationTitle}>
                모델하우스 방문예약
              </span>

              <span className={styles.reservationDesc}>
                특별혜택 자세히 상담받기
              </span>
            </span>

            <span
              className={styles.reservationArrow}
              aria-hidden="true"
            >
              →
            </span>
          </button>

          <div className={styles.btnContainer}>
            <button
              type="button"
              className={styles.todayNotOpenBtn}
              onClick={handleTodayClose}
            >
              오늘 하루 보지 않기
            </button>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
            >
              닫기
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
};

export default MobilePopup;