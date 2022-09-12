import React, { useEffect, useState } from 'react';
import styles from './IntroductionFlow.module.scss';

const baseWaypoint = {
  id: 0,
  title: '',
  text: '',
  classes: [''],
};

// Does not need to be in usestate
// Because it is used in setActiveWaypoint() which rerenders component
let waypoints = [
  {
    id: 1,
    title: 'Planning',
    text: 'Plan your adventure with the Route planner.',
    classes: [styles['planning'], styles['waypoint-auto-hover']],
  },
  {
    id: 2,
    title: 'Packing',
    text: 'Do not forget to pack your stuff.',
    classes: [styles['packing']],
  },
  {
    id: 3,
    title: 'Experience',
    text: 'Do not forget to enjoy and capture your moments.',
    classes: [styles['experience']],
  },
  {
    id: 4,
    title: 'Visualize',
    text: "Create a visualization from your memories and don't forget to show them to others.",
    classes: [styles['visualize']],
  },
];

const IntroductionFlow = () => {
  const [activeWaypoint, setActiveWaypoint] = useState(waypoints[0]);
  const [waypointHovered, setWaypointHovered] = useState(false);
  const [textClass, setTextClass] = useState(styles['fade-in']);

  useEffect(() => {
    let fadeoutTimeout: ReturnType<typeof setTimeout>;
    if (!waypointHovered) {
      fadeoutTimeout = setTimeout(() => {
        setTextClass(styles['fade-out']);
      }, 6300);

      const changeTimeout = setTimeout(() => {
        setActiveWaypoint((prevState) => {
          const id = prevState.id === 4 ? 1 : prevState.id + 1;
          const waypoint = waypoints.find((waypoint) => waypoint.id === id);

          setTextClass(styles['fade-in']);

          if (waypoint) {
            // add and remove waypoint-auto-hover classes
            const prevWaypoint = waypoints.find(
              (waypoint) => waypoint.id === prevState.id
            )!;
            if (prevWaypoint.classes.length > 1) {
              waypoints[waypoints.indexOf(prevWaypoint)].classes.pop();
            }
            if (waypoint.classes.length === 1) {
              waypoints[waypoints.indexOf(waypoint)].classes.push(
                styles['waypoint-auto-hover']
              );
            }

            return waypoint;
          }

          return baseWaypoint;
        });
      }, 8000);
      return () => {
        clearTimeout(changeTimeout);
        if (fadeoutTimeout) {
          clearTimeout(fadeoutTimeout);
        }
      };
    }
  }, [activeWaypoint, waypointHovered]);

  const hoverWaypointHandler = (event: React.MouseEvent) => {
    setTextClass(styles['fade-in']);

    setWaypointHovered(true);

    const target = event.target as HTMLDivElement;
    setActiveWaypoint(() => {
      // add and remove waypoint-auto-hover classes
      waypoints.map((waypoint) => {
        if (waypoint.id.toString() === target.id) {
          if (waypoint.classes.length === 1) {
            waypoints[waypoints.indexOf(waypoint)].classes.push(
              styles['waypoint-auto-hover']
            );
          }
        } else {
          if (waypoint.classes.length > 1) {
            waypoints[waypoints.indexOf(waypoint)].classes.pop();
          }
        }
      });

      const waypoint = waypoints.find(
        (waypoint) => waypoint.id.toString() === target.id
      );
      if (waypoint) {
        return waypoint;
      }
      return baseWaypoint;
    });
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Warpaint Adventure</h1>
        <p className={textClass}>{activeWaypoint.title}</p>
        <p className={textClass}>{activeWaypoint.text}</p>
        {waypoints.map((waypoint) => (
          <div
            key={waypoint.id.toString()}
            id={waypoint.id.toString()}
            className={waypoint.classes.join(' ')}
            onMouseEnter={hoverWaypointHandler}
            onMouseLeave={() => setWaypointHovered(false)}
          ></div>
        ))}
      </div>
    </>
  );
};

export default IntroductionFlow;
