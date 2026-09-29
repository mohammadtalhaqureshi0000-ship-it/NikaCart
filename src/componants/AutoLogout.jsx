import React, { useCallback, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { logoutUser as reduxLogout } from "../features/auth/authSlice";

import { clearOrders } from "../features/Orders/ordersSlice";

import { logoutUser as supabaseLogout } from "../supabase/authService";

// 1 minute = 60,000 milliseconds
const INACTIVITY_TIME = 1 * 60 * 1000;

const AutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const timerRef = useRef(null);

  const loggingOutRef = useRef(false);

  const handleAutoLogout = useCallback(async () => {
    if (!currentUser || loggingOutRef.current) {
      return;
    }

    loggingOutRef.current = true;

    try {
      await supabaseLogout();
    } catch (error) {
      console.error("Automatic logout error:", error);
    } finally {
      dispatch(reduxLogout());

      dispatch(clearOrders());

      toast("You were logged out after 1 minute of inactivity.", {
        icon: "🔒",
        duration: 5000,
      });

      navigate("/welcome", {
        replace: true,
      });

      loggingOutRef.current = false;
    }
  }, [currentUser, dispatch, navigate]);

  const resetTimer = useCallback(() => {
    if (!currentUser) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(handleAutoLogout, INACTIVITY_TIME);
  }, [currentUser, handleAutoLogout]);

  useEffect(() => {
    if (!currentUser) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      return;
    }

    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    // Start timer when user logs in
    resetTimer();

    // Reset timer whenever user is active
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, {
        passive: true,
      });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser, resetTimer]);

  return null;
};

export default AutoLogout;
