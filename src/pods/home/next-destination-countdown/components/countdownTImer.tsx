"use client";

import { useState, useEffect } from "react";
import styles from "./countdownTimer.module.scss";
import { useNextDestination } from "../hook/useNextDestination";

const CountdownTimer: React.FC = () => {
  const { nextDestinations, addNextDestination } = useNextDestination();
  const nextDestination = nextDestinations[0] || null;
  const [timeLeft, setTimeLeft] = useState<{
    days: number | undefined;
    hours: number | undefined;
    minutes: number | undefined;
    seconds: number | undefined;
  }>({
    days: undefined,
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
  });

  const [showModal, setShowModal] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: "",
    targetDate: "",
  });
  // const [aiResponse, setAiResponse] = useState<string | null>(null);
  // const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (!nextDestination?.targetDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(nextDestination.targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDestination?.targetDate]);

  const handleCreateDestination = async () => {
    try {
      const newDestinationWithDate = {
        id: crypto.randomUUID(),
        ...newDestination,
        createdDate: new Date().toISOString(),
      };

      await addNextDestination(newDestinationWithDate);
      setShowModal(false);
      setNewDestination({ name: "", targetDate: "" });

      // const trends = await fetchTrendingActivities(newDestinationWithDate.name);
      // if (trends) {
      //   setAiResponse(trends.join(", "));
      //   setShowAiModal(true);
      // }
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const polarToCartesian = (
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const SVGCircle = ({
    radius,
    value,
    label,
  }: {
    radius: number;
    value: number | undefined;
    label: string;
  }) => (
    <svg
      className={styles.countdownSvg}
      viewBox="0 0 120 120"
      width="80"
      height="80"
    >
      <path
        fill="none"
        stroke="#333"
        strokeWidth="4"
        d={describeArc(50, 50, 48, 0, radius)}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.countdownText}
      >
        {value}
      </text>
      <text
        x="50"
        y="65"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.countdownLabel}
      >
        {label}
      </text>
    </svg>
  );

  const mapNumber = (
    number: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) => {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const { days, hours, minutes, seconds } = timeLeft;
  const createdDate = new Date(nextDestination?.createdDate || new Date());
  const targetDate = new Date(nextDestination?.targetDate || new Date());

  const maxDays = Math.ceil(
    (targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysRadius = mapNumber(days || 0, maxDays, 0, 0, 360);
  const hoursRadius = mapNumber(hours || 0, 24, 0, 0, 360);
  const minutesRadius = mapNumber(minutes || 0, 60, 0, 0, 360);
  const secondsRadius = mapNumber(seconds || 0, 60, 0, 0, 360);

  useEffect(() => {
    if (!showModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  useEffect(() => {
    if (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      const nextIndex =
        nextDestinations.findIndex(
          (destination) => destination.name === nextDestination?.name
        ) + 1;

      if (nextIndex < nextDestinations.length) {
        const newNextDestination = nextDestinations[nextIndex];
        setTimeLeft({
          days: undefined,
          hours: undefined,
          minutes: undefined,
          seconds: undefined,
        });
        nextDestination.name = newNextDestination.name;
        nextDestination.targetDate = newNextDestination.targetDate;
      }
    }
  }, [timeLeft, nextDestinations, nextDestination]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cuenta regresiva para mi próximo viaje</h1>

      <h2 className={styles.subtitle}>
        {nextDestination?.name || "Next Destination"}
      </h2>
      <div className={styles.countdownWrapper}>
        {days !== undefined && (
          <div className={styles.countdownItem}>
            <SVGCircle radius={daysRadius} value={days} label="days" />
          </div>
        )}
        {hours !== undefined && (
          <div className={styles.countdownItem}>
            <SVGCircle radius={hoursRadius} value={hours} label="hours" />
          </div>
        )}
        {minutes !== undefined && (
          <div className={styles.countdownItem}>
            <SVGCircle radius={minutesRadius} value={minutes} label="minutes" />
          </div>
        )}
        {seconds !== undefined && (
          <div className={styles.countdownItem}>
            <SVGCircle radius={secondsRadius} value={seconds} label="seconds" />
          </div>
        )}
      </div>
      <button
        className={styles.createButton}
        onClick={() => setShowModal(true)}
      >
        Create New Destination
      </button>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Destination Name"
                value={newDestination.name}
                className={styles.input}
                onChange={(e) =>
                  setNewDestination({ ...newDestination, name: e.target.value })
                }
              />
              <input
                type="datetime-local"
                placeholder="Target Date"
                value={newDestination.targetDate}
                className={styles.input}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) =>
                  setNewDestination({
                    ...newDestination,
                    targetDate: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.saveButton}
                onClick={handleCreateDestination}
              >
                Save
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {showAiModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Ideas populares para tu viaje a {newDestination.name}</h3>
            <p>{aiResponse}</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.saveButton}
                onClick={() => setShowAiModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CountdownTimer;
